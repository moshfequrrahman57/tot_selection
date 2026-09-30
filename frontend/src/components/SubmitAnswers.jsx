import React, {useContext} from "react";
import { AuthContext } from "./AuthContext";

export default function SubmitAnswers(){

    const {user, loading}=useContext(AuthContext);

    if(loading) return <p> Loading Submission</p>
    return(
        <>
        
        </>
    )
}