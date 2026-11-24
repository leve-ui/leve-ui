import { type PartytownConfig, partytownSnippet } from '@qwik.dev/partytown/integration';

/**
 * Props accepted by {@link QwikPartytown}.
 */
export type PartytownProps = PartytownConfig;

/**
 * Injects the Partytown initialization snippet into `<head>`.
 */
export const QwikPartytown = (props: PartytownProps) => {
  return <script dangerouslySetInnerHTML={partytownSnippet(props)} />;
};
