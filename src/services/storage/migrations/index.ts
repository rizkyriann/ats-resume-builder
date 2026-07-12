import { SCHEMA_VERSION } from '@/types/resume'

/** Thrown when stored/imported data has a newer schema than this app build. */
export class UnsupportedSchemaVersionError extends Error {
  readonly foundVersion: number
  readonly supportedVersion: number
  constructor(foundVersion: number) {
    super(
      `This file was created with a newer version of the app (schema v${foundVersion}, ` +
        `this build supports up to v${SCHEMA_VERSION}). Please update the app.`,
    )
    this.name = 'UnsupportedSchemaVersionError'
    this.foundVersion = foundVersion
    this.supportedVersion = SCHEMA_VERSION
  }
}

/**
 * A single migration step: pure function upgrading data by exactly one version.
 * Keyed by the version it upgrades FROM.
 */
export type Migration = (data: Record<string, unknown>) => Record<string, unknown>

/**
 * Ordered migration chain. To add a future breaking change:
 *   1. bump SCHEMA_VERSION in types/resume.ts
 *   2. add `2: migrateV1toV2` here (upgrades FROM v1 TO v2)
 * Existing users' data then upgrades transparently on next load/import.
 */
const MIGRATIONS: Record<number, Migration> = {
  // 2: (data) => ({ ...data, schemaVersion: 2, newField: defaultValue }),
}

/**
 * Upgrade raw parsed data to the current schema version.
 * Runs the migration chain step-by-step. Throws
 * UnsupportedSchemaVersionError if the data is newer than we support.
 */
export function migrate(data: Record<string, unknown>): Record<string, unknown> {
  let version = typeof data.schemaVersion === 'number' ? data.schemaVersion : 1
  let current = data

  if (version > SCHEMA_VERSION) {
    throw new UnsupportedSchemaVersionError(version)
  }

  while (version < SCHEMA_VERSION) {
    const nextVersion = version + 1
    const step = MIGRATIONS[nextVersion]
    if (!step) {
      // No migration registered but versions differ — treat as unsupported
      // rather than silently accepting a shape we can't guarantee.
      throw new UnsupportedSchemaVersionError(version)
    }
    current = step(current)
    version = nextVersion
  }

  return current
}
