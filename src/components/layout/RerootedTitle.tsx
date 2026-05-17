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
  showBreak = false,
}: {
  prefix?: string;
  suffix: string;
  showBreak?: boolean;
}) => (
  <span className={showBreak ? "inline-block text-left align-middle" : ""}>
    {prefix && <>{prefix}&nbsp;&nbsp;</>}
    <span className="whitespace-nowrap">
      <img
        src={logoR}
        alt="R"
        className="inline-block h-[0.72em] w-auto align-baseline"
      />
      e-Rooted<sup className="text-[0.45em] font-bold align-super ml-0.5">®</sup>
    </span>
    {showBreak ? <br /> : ' '}
    {suffix}
  </span>
);

export default RerootedTitle;
