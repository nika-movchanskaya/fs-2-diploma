import { Header } from "../widgets/Header";

export const InformationPage = (props: any) => {    
    return (
        <>
            <Header/>
            {props.children}
        </>
    )
}
