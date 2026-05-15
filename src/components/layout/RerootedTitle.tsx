import logoR from '@/assets/logo-r-white.png';

/**
 * Title text where the leading "R" of "Re-Rooted" is replaced with the
 * white R logo, matching the Cultural Companion title treatment.
 *
 * Pass the words that come BEFORE "Re-Rooted" as `prefix` (e.g. "My"),
 * and the words that come AFTER as `suffix` (e.g. "Coach").
 */
export const RerootedTitle = ({
  prefix,
  suffix,
}: {
  prefix: string;
  suffix: string;
}) => (
  <span>
    {prefix}&nbsp;&nbsp;
    <img
      src={logoR}
      alt="R"
      className="inline-block h-[0.72em] w-auto align-baseline"
    />
    e-Rooted<sup className="text-[0.45em] font-bold align-super ml-0.5">®</sup>{' '}
    {suffix}
  </span>
);

export default RerootedTitle;
