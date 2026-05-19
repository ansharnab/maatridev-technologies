import { SECTION_TYPES } from "./sectionRegistry";
import StyledSectionWrap from "./StyledSectionWrap";
import "./styled-section.css";

export default function PageSectionsView({ sections = [] }) {
  return (
    <>
      {sections.map((section) => {
        const def = SECTION_TYPES[section.type];
        if (!def) return null;
        const Component = def.component;
        return (
          <StyledSectionWrap key={section.id} sectionType={section.type} style={section.style}>
            <Component {...(section.props || {})} />
          </StyledSectionWrap>
        );
      })}
    </>
  );
}
