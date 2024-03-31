import SearchResultCard from './SearchResultCard';

// Component to populate search results into cards
export default function SearchResults(props) {
  const filteredModules = props.filteredModules;

  const searchResults = filteredModules.map((module) => {
    return (
      <SearchResultCard
        key={module.moduleCode}
        title={module.title}
        moduleCode={module.moduleCode}
        semesters={module.semesters}
        moduleAdded={module.moduleAdded}
        addModuleHandler={props.addModuleHandler}
      />
    );
  });

  return searchResults;
}
