export const createRequest = async(options:{
    url: string,
    sendMethod: string,
    id?: number,
    data?: any,
    callback: (data: any[]) => void
}) => {

    let strRequest = `${options.url}`;
    if (options.id) {
        strRequest += `${options.id}`;
    }
    console.log("strRequest " + strRequest);

    if (options.sendMethod === 'GET') {
        fetch(strRequest, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                options.callback(data);
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
                alert(error);
            })
    }
    else if (options.sendMethod === 'POST' || options.sendMethod === 'PATCH') {
        fetch(strRequest, {
            method: options.sendMethod,
            body: JSON.stringify(options.data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((data: any) => {
                console.log(data);
                options.callback(data);
            })
            .catch((error) => {
                console.error(`Error: ${error}`);
                alert(error);
            })
    }
}
