function StatusBar(){
    return <div>Dummy status bar: Unpublished/Published/Rejected/Accepted/Superceded</div>;
}

function EditableText(){
    return <TextArea>Dummy text</TextArea>;
}

function MainTextContent(){
    return <EditableText/>;
}

function ChangeMotivation(){
    return <EditableText/>;
}

function ListOfSupporters(){
    return <ul>
        <li>Person 1</li>
        <li>Person 2</li>
        <li>Person 3</li>
        <li>Person 4</li>
        <li>+Add person</li>
    </ul>
}

function SaveButton(){
    return <Button>Save</Button>
}
function PublishButton(){
    return <Button>Publish</Button>
}



export default function ChangeEditPage() {
return (
    <>
        <StatusBar/>
        <MainTextContent/>
        <ChangeMotivation/>
        <ListOfSupporters/>
        <SaveButton/>
        <PublishButton/>
    </>
);
}