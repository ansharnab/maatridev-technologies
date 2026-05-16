import { SECTION_TYPES } from "./sectionRegistry";

export default function PageSectionsView({ sections = [] }) {
  return (
    <>
      {sections.map((section) => {
        const def = SECTION_TYPES[section.type];
        if (!def) return null;
        const Component = def.component;
        return <Component key={section.id} {...(section.props || {})} />;
      })}
    </>
  );
}
