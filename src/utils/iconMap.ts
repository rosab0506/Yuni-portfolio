import {
  Linkedin,
  Github,
  Twitter,
  Facebook,
  Instagram, // Ensure this exists or use Camera/Image
  Youtube,
  Twitch,
  Dribbble,
  Figma,
  BookOpen, // Medium, Blog
  GraduationCap, // Scholar, Education
  Briefcase, // Upwork, Fiverr
  BarChart, // Kaggle
  Code, // StackOverflow, GitHub, GitLab
  Globe, // Custom/Website
  Mail, // Email
  MessageCircle, // WhatsApp, Telegram, Discord
  Send, // Telegram alternate
  Video, // TikTok, Vimeo
  Image as ImageIcon, // Pinterest, Flickr
  Music, // Spotify, SoundCloud
  Hash, // Hashtag/Social
  Link, // Generic
  Coffee, // Ko-fi, BuyMeACoffee
  Gamepad2, // Discord
  Pin, // Pinterest
  Smartphone, // Signal, WhatsApp
  Tv, // YouTube, Vimeo
  Mic, // Podcast/SoundCloud
  Palette, // Behance, Dribbble, ArtStation
  ShoppingBag, // ProductHunt
  Gitlab, // If available, else Code
} from 'lucide-react';

import type { SocialPlatformKey } from './detectSocialPlatform';

// Helper to cast generic icons to exact type if needed, though Lucide icons are generally compatible
// We will use 'any' cast for the map to allow flexible assignment if types don't perfectly align
export const iconMap: Record<string, any> = {
  // Professional
  linkedin: Linkedin,
  github: Github,
  gitlab: Gitlab || Code,
  bitbucket: Code,
  stackoverflow: Code,
  kafka: Code,
  medium: BookOpen,
  devto: Code,
  hashnode: BookOpen,
  codepen: Code,
  codesandbox: Code,
  leetcode: Code,
  hackerrank: Code,
  kaggle: BarChart,
  researchgate: GraduationCap,
  google_scholar: GraduationCap,
  upwork: Briefcase,
  fiverr: Briefcase,
  freelancer: Briefcase,

  // Social
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram || ImageIcon,
  youtube: Youtube,
  tiktok: Video,
  snapchat: ImageIcon, // No ghost icon in standard set usually
  pinterest: Pin || ImageIcon,
  reddit: MessageCircle,
  discord: Gamepad2 || MessageCircle,
  twitch: Twitch,
  whatsapp: MessageCircle,
  telegram: Send,
  signal: Smartphone,
  slack: Hash,
  skype: MessageCircle,
  wechat: MessageCircle,
  line: MessageCircle,
  threads: Hash,
  bluesky: Twitter, // Placeholder
  mastodon: Hash,
  tumblr: BookOpen,
  vk: Globe,
  weibo: Globe,

  // Creative
  dribbble: Dribbble,
  behance: Palette,
  vimeo: Video,
  soundcloud: Music,
  spotify: Music,
  applemusic: Music,
  flickr: ImageIcon,
  '500px': ImageIcon,
  unsplash: ImageIcon,
  deviantart: Palette,
  artstation: Palette,
  producthunt: ShoppingBag,
  patreon: Coffee,
  kofi: Coffee,
  buymeacoffee: Coffee,

  // Other
  website: Globe,
  email: Mail,
  custom: Link,
};
