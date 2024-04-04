import classes from './Messages.module.css';

export default function Messages({ children }) {
    return (
        <div className={classes.chats}>
            {children}
        </div>
    )
}