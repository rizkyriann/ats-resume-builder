/**
 * Common English stopwords + generic job-posting boilerplate that carries no
 * signal as a "keyword to match". Kept deliberately conservative so genuine
 * skills are never filtered out.
 */
export const STOPWORDS: ReadonlySet<string> = new Set([
  'a', 'about', 'above', 'across', 'after', 'again', 'against', 'all', 'also',
  'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before',
  'being', 'below', 'between', 'both', 'but', 'by', 'can', 'cannot', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'etc', 'few', 'for',
  'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it',
  'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor',
  'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'per', 'same', 'she', 'should', 'so',
  'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
  'under', 'until', 'up', 'upon', 'us', 'very', 'was', 'we', 'were', 'what',
  'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with',
  'would', 'you', 'your', 'yours', 'yourself', 'yourselves',
  // job-posting boilerplate
  'ability', 'able', 'across', 'e', 'g', 'ie', 'eg', 'etc', 'including', 'include',
  'includes', 'work', 'working', 'role', 'job', 'position', 'candidate', 'team',
  'teams', 'years', 'year', 'strong', 'good', 'great', 'excellent', 'plus',
  'must', 'required', 'require', 'requirements', 'qualifications', 'responsibilities',
  'preferred', 'experience', 'experienced', 'looking', 'seeking', 'company',
  'help', 'well', 'new', 'using', 'use', 'used', 'within', 'day', 'daily',
])
