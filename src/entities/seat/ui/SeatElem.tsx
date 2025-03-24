import { Seat } from "../model/Seat"

export const SeatElem = (props: {seat: Seat, selected: boolean, onClick: any }) => {
    const {seat, selected, onClick} = props;
    let className;

    if (selected) {
        className = "buying-scheme__chair_selected";
    }
    else if (seat.status === "available" && seat.is_vip) {
        className = "buying-scheme__chair_vip";
    }
    else if (seat.status === "available" && !seat.is_vip) {
        className = "buying-scheme__chair_standart";
    }
    else if (seat.status === "disabled") {
        className = "buying-scheme__chair_disabled";
    }
    else {
        className = "buying-scheme__chair_taken";
    }

    return (
        <span className={`buying-scheme__chair ${className}`} onClick={onClick}></span>
    )
}