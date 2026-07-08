import { useCallback, useEffect, useState } from "react";
import * as vehicleApi from "../api/vehicleApi";

/**
 * Encapsulates all vehicle list state (data, loading, error, search)
 * and CRUD actions, so the page component stays focused on layout/JSX.
 */
export function useVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchVehicles = useCallback(async (searchTerm = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await vehicleApi.getVehicles(searchTerm);
      setVehicles(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchVehicles(search);
    }, 300); // debounce search input

    return () => clearTimeout(timeoutId);
  }, [search, fetchVehicles]);

  const addVehicle = useCallback(async (payload) => {
    const res = await vehicleApi.createVehicle(payload);
    setVehicles((prev) => [res.data, ...prev]);
    return res.data;
  }, []);

  const editVehicle = useCallback(async (id, payload) => {
    const res = await vehicleApi.updateVehicle(id, payload);
    setVehicles((prev) => prev.map((v) => (v.id === id ? res.data : v)));
    return res.data;
  }, []);

  const removeVehicle = useCallback(async (id) => {
    await vehicleApi.deleteVehicle(id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  return {
    vehicles,
    isLoading,
    error,
    search,
    setSearch,
    addVehicle,
    editVehicle,
    removeVehicle,
    refetch: () => fetchVehicles(search),
  };
}
