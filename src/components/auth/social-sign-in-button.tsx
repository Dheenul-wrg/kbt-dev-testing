import Image from 'next/image';
interface SocialSignButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

export function SocialSignButton({
  icon,
  label,
  onClick,
  className,
}: SocialSignButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={
        className ||
        'w-full h-[35px] mb-[9px] bg-transparent border rounded-[3px] border-kbt-button-border text-white text-[10px] font-gt-america-medium flex items-center tracking-widest'
      }
    >
      <Image src={icon} alt={label} width={13} height={13} />
      {label}
    </button>
  );
}
