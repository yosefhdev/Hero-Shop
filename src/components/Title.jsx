import React from "react";

const Title = ({ title }) => {

    return (
        <>
            <h1 className="text-black text-4xl font-bold mb-4">
                {title}
            </h1>
        </>
    );
}

export default Title;