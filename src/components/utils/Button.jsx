function Button({ text, onClick, ...props }) {
    return (
        <button onClick={onClick} {...props}>
            {text}
        </button>
    );
}

export default Button