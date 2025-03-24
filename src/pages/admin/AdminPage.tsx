import { AdminHeader } from "../../widgets/AdminHeader";

export const AdminPage = (props: any) => {    
    return (
        <>
            <AdminHeader/>
            {props.children}
        </>
    )
}
