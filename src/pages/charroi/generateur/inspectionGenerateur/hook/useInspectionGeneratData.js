import { use, useCallback } from "react";
import { useState } from "react";

const useInspectionGeneratData = (initialFilters = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const load = useCallback(
    async (overrideFilters = undefined) => {
        const effective = overrideFilters ?? filters;
        setLoading(true);

        try {
            
        } catch (error) {
            
        }
    }
  )
}