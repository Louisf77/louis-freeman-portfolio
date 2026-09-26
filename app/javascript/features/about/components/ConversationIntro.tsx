import PlaceholderSection from "~/components/PlaceholderSection/PlaceholderSection";
import type { AboutIntro, ChatMessage } from "~/types/contracts";

interface ConversationIntroProps {
  conversation: ChatMessage[];
  intro: AboutIntro;
}

function ConversationIntro({ intro }: ConversationIntroProps) {
  return <PlaceholderSection heading={intro.heading} headingLevel={1} id="hi" />;
}

export default ConversationIntro;
