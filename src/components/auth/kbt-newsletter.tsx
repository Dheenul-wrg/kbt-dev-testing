'use client';

interface KBTNewsletterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

export function KBTNewsletter({
  checked,
  onChange,
  id = 'newsletter',
}: KBTNewsletterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex items-start space-x-[13px]">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        className="w-4 h-4 border border-white bg-transparent checked:bg-white checked:text-white rounded-sm cursor-pointer"
      />
      <label
        htmlFor={id}
        className="text-[0.65625rem] text-kbt-normal-text font-medium cursor-pointer"
      >
        I WOULD LIKE TO SUBSCRIBE TO THE KENTUCKY BOURBON TRAIL<sup>®</sup>{' '}
        NEWSLETTERS
      </label>
    </div>
  );
}
