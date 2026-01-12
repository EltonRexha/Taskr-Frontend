import React from 'react'

function CoolDownBtn({ coolDownMs, message, coolDownProps = {}, ...props }: { coolDownMs: number, message: string, coolDownProps?: { [k: string]: any }, [p: string]: any }) {
    const [coolDownMsLeft, setCoolDownMsLeft] = React.useState(0);

    function onClick() {
        setCoolDownMsLeft(coolDownMs);

        const interval = setInterval(() => {
            setCoolDownMsLeft((prev) => {
                if (prev <= 1000) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);
    }

    if (coolDownMsLeft > 0) {
        return (
            <button {...props} {...coolDownProps} disabled>Resend Again in {coolDownMsLeft / 1000}'s</button>
        )
    }

    return (
        <button
            {...props}
            onClick={(e) => {
                onClick();
                props.onClick?.(e);
            }}
        >
            {message}
        </button>
    )
}

export default CoolDownBtn