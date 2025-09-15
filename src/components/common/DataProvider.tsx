"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface DataProviderProps<T> {
  data: T;
  children: ReactNode;
}

interface DataContextValue<T> {
  data: T;
}

function createDataProvider<T>() {
  const DataContext = createContext<DataContextValue<T> | undefined>(undefined);

  function DataProvider({ data, children }: DataProviderProps<T>) {
    return (
      <DataContext.Provider value={{ data }}>
        {children}
      </DataContext.Provider>
    );
  }

  function useData(): T {
    const context = useContext(DataContext);
    if (!context) {
      throw new Error("useData must be used within a DataProvider");
    }
    return context.data;
  }

  return { DataProvider, useData };
}

export { createDataProvider };