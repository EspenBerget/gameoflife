import './Example.css';


function Example(props) {
    return (
        <button className="example" onClick={props.whenPressed}>
            {props.title}
        </button>
    );
}

export default Example;