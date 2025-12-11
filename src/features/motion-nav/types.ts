export type MotionNavListItem = {
  key: string;
  href: string;
  locale?: string;
  label: string;
  isActive: boolean;
  isAvailable: boolean;
  comingSoonLabel: string;
};

export type MotionNavListSection = {
  key: string;
  label: string;
  items: MotionNavListItem[];
};
