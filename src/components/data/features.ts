import {
  sortFn_text,
  tableFeatures,
  filterFn_arrHas,
  rowSortingFeature,
  rowSelectionFeature,
  sortFn_alphanumeric,
  createSortedRowModel,
  rowPaginationFeature,
  filterFn_equalsString,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  columnVisibilityFeature,
  filterFn_arrIncludesSome,
} from "@tanstack/react-table";

export const features = tableFeatures({
  columnVisibilityFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    arrHas: filterFn_arrHas,
    includesString: filterFn_includesString,
    equalsString: filterFn_equalsString,
    arrIncludesSome: filterFn_arrIncludesSome,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    text: sortFn_text,
  },
});

export type DataTableFeatures = typeof features;
