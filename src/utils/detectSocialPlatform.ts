export type SocialPlatformKey =
  // Professional
  | 'linkedin'
  | 'github'
  | 'gitlab'
  | 'bitbucket'
  | 'stackoverflow'
  | 'kafka' // Just in case
  | 'medium'
  | 'devto'
  | 'hashnode'
  | 'codepen'
  | 'codesandbox'
  | 'leetcode'
  | 'hackerrank'
  | 'kaggle'
  | 'researchgate'
  | 'google_scholar'
  | 'upwork'
  | 'fiverr'
  | 'freelancer'
  // Social
  | 'twitter'
  | 'facebook'
  | 'instagram'
  | 'youtube'
  | 'tiktok'
  | 'snapchat'
  | 'pinterest'
  | 'reddit'
  | 'discord'
  | 'twitch'
  | 'whatsapp'
  | 'telegram'
  | 'signal'
  | 'slack'
  | 'skype'
  | 'wechat'
  | 'line'
  | 'threads'
  | 'bluesky'
  | 'mastodon'
  | 'tumblr'
  | 'vk'
  | 'weibo'
  // Creative
  | 'dribbble'
  | 'behance'
  | 'vimeo'
  | 'soundcloud'
  | 'spotify'
  | 'applemusic'
  | 'flickr'
  | '500px'
  | 'unsplash'
  | 'deviantart'
  | 'artstation'
  | 'producthunt'
  | 'patreon'
  | 'kofi'
  | 'buymeacoffee'
  // Other
  | 'website'
  | 'email'
  | 'custom';

export type DetectedSocial = {
  platform: SocialPlatformKey;
  iconKey: SocialPlatformKey;
  label: string;
};

const normalizeHost = (url: string) => {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
};

const extractLabelFromHost = (host: string) => {
  if (!host) return 'Custom';
  const core = host.split('.')[0] || host;
  return core.charAt(0).toUpperCase() + core.slice(1);
};

export const formatPlatformLabel = (platform: string, fallbackLabel?: string) => {
  switch (platform) {
    case 'google_scholar': return 'Google Scholar';
    case 'stackoverflow': return 'Stack Overflow';
    case 'twitter': return 'Twitter/X';
    case 'youtube': return 'YouTube';
    case 'github': return 'GitHub';
    case 'gitlab': return 'GitLab';
    case 'linkedin': return 'LinkedIn';
    case 'devto': return 'Dev.to';
    case 'producthunt': return 'Product Hunt';
    case 'buymeacoffee': return 'Buy Me a Coffee';
    case 'applemusic': return 'Apple Music';
    case 'custom': return fallbackLabel ?? 'Custom';
    default:
      return platform
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase());
  }
};

export const detectSocialPlatform = (url: string): DetectedSocial => {
  const host = normalizeHost(url);

  // Map of domain parts to platform keys
  const platformMap: Record<string, SocialPlatformKey> = {
    // Professional
    'linkedin.com': 'linkedin',
    'github.com': 'github',
    'gitlab.com': 'gitlab',
    'bitbucket.org': 'bitbucket',
    'stackoverflow.com': 'stackoverflow',
    'stackexchange.com': 'stackoverflow',
    'medium.com': 'medium',
    'dev.to': 'devto',
    'hashnode.com': 'hashnode',
    'codepen.io': 'codepen',
    'codesandbox.io': 'codesandbox',
    'leetcode.com': 'leetcode',
    'hackerrank.com': 'hackerrank',
    'kaggle.com': 'kaggle',
    'researchgate.net': 'researchgate',
    'scholar.google.com': 'google_scholar',
    'upwork.com': 'upwork',
    'fiverr.com': 'fiverr',
    'freelancer.com': 'freelancer',

    // Social
    'twitter.com': 'twitter',
    'x.com': 'twitter',
    'facebook.com': 'facebook',
    'fb.com': 'facebook',
    'instagram.com': 'instagram',
    'instagr.am': 'instagram',
    'youtube.com': 'youtube',
    'youtu.be': 'youtube',
    'tiktok.com': 'tiktok',
    'snapchat.com': 'snapchat',
    'pinterest.com': 'pinterest',
    'reddit.com': 'reddit',
    'discord.com': 'discord',
    'discord.gg': 'discord',
    'twitch.tv': 'twitch',
    'whatsapp.com': 'whatsapp',
    'wa.me': 'whatsapp',
    'telegram.org': 'telegram',
    't.me': 'telegram',
    'signal.org': 'signal',
    'slack.com': 'slack',
    'skype.com': 'skype',
    'wechat.com': 'wechat',
    'line.me': 'line',
    'threads.net': 'threads',
    'bsky.app': 'bluesky',
    'mastodon.social': 'mastodon', // Simple check
    'tumblr.com': 'tumblr',
    'vk.com': 'vk',
    'weibo.com': 'weibo',

    // Creative
    'dribbble.com': 'dribbble',
    'behance.net': 'behance',
    'vimeo.com': 'vimeo',
    'soundcloud.com': 'soundcloud',
    'spotify.com': 'spotify',
    'music.apple.com': 'applemusic',
    'flickr.com': 'flickr',
    '500px.com': '500px',
    'unsplash.com': 'unsplash',
    'deviantart.com': 'deviantart',
    'artstation.com': 'artstation',
    'producthunt.com': 'producthunt',
    'patreon.com': 'patreon',
    'ko-fi.com': 'kofi',
    'buymeacoffee.com': 'buymeacoffee',
  };

  // Exact match first
  for (const [domain, platform] of Object.entries(platformMap)) {
    if (host === domain || host.endsWith('.' + domain)) {
      return { platform, iconKey: platform, label: formatPlatformLabel(platform) };
    }
  }

  // Partial match fallback
  for (const [domain, platform] of Object.entries(platformMap)) {
    if (host.includes(domain)) {
      return { platform, iconKey: platform, label: formatPlatformLabel(platform) };
    }
  }

  // Special cases that don't fit the map nicely or need more logic
  if (host.includes('mastodon')) return { platform: 'mastodon', iconKey: 'mastodon', label: 'Mastodon' };

  if (url.startsWith('mailto:')) {
    return { platform: 'email', iconKey: 'email', label: 'Email' };
  }

  const label = extractLabelFromHost(host);
  return { platform: 'custom', iconKey: 'custom', label };
};
