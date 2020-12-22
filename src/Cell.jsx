import './Cell.css';

function Cell(props) {
    return (
        <div className={"cell" + (props.state ? " on" : " off")} onClick={props.whenUpdate}></div>
    );
}

export default Cell;