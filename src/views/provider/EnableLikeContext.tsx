import React, { createContext, useContext, useEffect, useState } from "react";
import getEnableLike from "../../functions/getEnableLike";

const EnableLikeContext = createContext<boolean>(false)
export const EnableLikeProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    getEnableLike().then(rs => {
      setEnabled(rs)
    })
  })
  return (
    <EnableLikeContext.Provider value={enabled}>
      {children}
    </EnableLikeContext.Provider>
  )
}
export const GetEnableLikeContext = () => {
  const context = useContext(EnableLikeContext)
  return context
}
