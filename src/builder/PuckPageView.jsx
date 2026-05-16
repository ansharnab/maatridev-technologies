import { Render } from "@measured/puck";
import { puckConfig } from "./puck/config";

export default function PuckPageView({ data }) {
  if (!data?.content?.length) return null;
  return <Render config={puckConfig} data={data} />;
}
