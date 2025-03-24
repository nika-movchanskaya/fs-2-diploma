import React, { useState } from "react";
import { SeatSchema } from "../../seat/model/SeatSchema";

interface HallSchemaProps {
    seats: SeatSchema[];
    onSeatStatusChange: (seatId: number, newStatus: "regular" | "vip" | "disabled") => void;
}

const HallSchema: React.FC<HallSchemaProps> = ({ seats, onSeatStatusChange }) => {
    const [contextMenu, setContextMenu] = useState<{ seatId: number; x: number; y: number } | null>(null);

    const handleClick = (event: React.MouseEvent, seatId: number) => {
        event.preventDefault();

        const parentElement = (event.target as HTMLElement).closest('.conf-step__hall-wrapper'); 

        if (parentElement) {
            const parentRect = parentElement.getBoundingClientRect();
    
            //calculate the position relative to the parent element
            const x = event.clientX - parentRect.left;
            const y = event.clientY - parentRect.top;

            setContextMenu({ seatId, x: x, y: y });
        }
        else {
            setContextMenu({ seatId, x: 0, y: 0 });
        }
    };

    const handleStatusChange = (newStatus: "regular" | "vip" | "disabled") => {
        if (contextMenu) {
            onSeatStatusChange(contextMenu.seatId, newStatus);
            setContextMenu(null);
        }
    };

    return (
        <div style={{ position: "relative" }}  className="hall-conteiner">
            {Array.from(new Set(seats.map(seat => seat.index_y))).map(rowIndex => (
                <div className="conf-step__row" key={rowIndex}>
                    {seats
                        .filter(seat => seat.index_y === rowIndex)
                        .sort((a, b) => a.index_x - b.index_x)
                        .map(seat => (
                            <span
                                key={seat.id}
                                className={`conf-step__chair conf-step__chair_${seat.status}`}
                                onClick={event => handleClick(event, seat.id)}
                            ></span>
                        ))}
                </div>
            ))}

            {contextMenu && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button onClick={() => handleStatusChange("regular")}>Regular</button>
                    <button onClick={() => handleStatusChange("vip")}>VIP</button>
                    <button onClick={() => handleStatusChange("disabled")}>Disabled</button>
                </div>
            )}
        </div>
    );
};

export default HallSchema;
