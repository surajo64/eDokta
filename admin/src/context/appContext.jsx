import { createContext } from "react";


export const AppContext = createContext();

const AppContextProvider = (props) =>{
const currencySymbol = '₦'
  const calculateAge = (dob) =>{

    const toDay = new Date();
    const birthDate = new Date(dob);
    let age = toDay.getFullYear() - birthDate.getFullYear();

    return age
  }

  const value = {
    calculateAge,
    currencySymbol
    }
    return(
  
      <AppContext.Provider value={value}>
        {props.children}
      </AppContext.Provider>
    )
  }
  export default AppContextProvider