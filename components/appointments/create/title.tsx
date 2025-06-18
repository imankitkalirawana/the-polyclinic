import { Image, Link } from '@heroui/react';
import { Icon } from '@iconify/react/dist/iconify.js';

export function AccordionTitle({
  isActive,
  image,
  title,
  subtitle,
  onPress,
}: {
  isActive: boolean;
  title: string;
  subtitle?: string | null;
  image?: string;
  onPress: () => void;
}) {
  return isActive ? (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold">{title}</h3>
      {!!subtitle && <div>{subtitle}</div>}
    </div>
  ) : (
    <div className="flex items-center gap-4">
      {!!image && (
        <div>
          <Image
            src={`${image}`}
            alt={title}
            width={80}
            height={80}
            className="rounded-full bg-primary-100"
          />
        </div>
      )}
      <div>
        <h2 className="text-large font-semibold">{title}</h2>
        {!!subtitle && <p>{subtitle}</p>}
        <Link
          className="hover:underline"
          onPress={() => {
            onPress();
          }}
        >
          Change <Icon icon="tabler:chevron-right" />
        </Link>
      </div>
    </div>
  );
}
