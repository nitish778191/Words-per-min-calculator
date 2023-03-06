import "./App.js"

const Profile =(props) =>
{

    return(
        <div id={"out"}>
            <a>{props.fname}</a>
            <a> {props.lname}</a>
            <a> {props.mail}</a>
            <a> {props.pass}</a>
            <a> {props.season}</a>
        </div>

    );
}





export default Profile;