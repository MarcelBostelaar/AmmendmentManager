import React, { useState, useEffect, useMemo } from 'react';
import {backendIP} from '../../config';

function StatusBar(){
    return <div>Dummy status bar: Unpublished/Published/Rejected/Accepted/Superceded</div>;
}

function EditableDocument(name, originalFileName = null, originalHash = null){
    /**
     * Editable document that retrieves the document if it has a name and hash and displays it.
     * Saves new version in the name, and the original file name in name+originalFileName of the form.
     */
    const apiUrl = backendIP + "/getdocument"
    const [initialText, setText] = useState("")
    useEffect(() => {
        if(originalFileName !== undefined && originalHash !== undefined){
            fetch(apiUrl + "?name=" + originalFileName + "&hash=" + originalHash)
                .then((response) => {
                if (response.status === 401) {
                    setText("You are not authorized to view this document.");
                }
                else{
                    if(!response.ok){
                        throw Error('There was a problem with the fetch operation:');
                    }
                }
                setText(response)
                })
                .catch((error) => {
                console.error('There was a problem with the fetch operation:', error);
                });
        }
        else if(originalFileName !== originalHash){
            throw Error("File or Hash supplied, but not both.")
        }
    }, [originalFileName, originalHash, setText, apiUrl])
    
    return <>
        <textarea
            name={name}
            defaultValue={initialText}
        />
        <input hidden value={originalFileName} name={originalFileName === undefined ? undefined : (name + "originalFileName")}/>
    </>;
}

function MainTextContent(originalFileName = null, originalHash = null){
    return <EditableDocument name="maintextcontent" originalFile={originalFileName} originalHash={originalHash}/>;
}

function ChangeMotivation(originalFileName = null, originalHash = null){
    return <EditableDocument name="changeMotivation" originalFile={originalFileName} originalHash={originalHash}/>;
}

function ListOfSupporters(originalFileName, originalHash){
    const [ExistingSupporters, setSupporters] = useState([]);
    const [newSupporters, setNewSupporters] = useState([]);

    const setPositionalNewSupporter = useMemo(() => (pos, newValue) => {
        setNewSupporters(old => old.map((v, i) => (i === pos ? newValue : v)))
    }, [setNewSupporters]);

    useEffect(() => {
        if (originalFileName !== null && originalHash !== null) {
            const apiUrl = backendIP + "/getsupporters";
            fetch(apiUrl + "?name=" + originalFileName + "&hash=" + originalHash)
                .then((response) => {
                    if (response.status === 401) {
                        return;
                    } else {
                        if (!response.ok) {
                            throw new Error('There was a problem with the fetch operation:');
                        }
                    }
                    return response.json();
                })
                .then((jsonResponse) => setSupporters(jsonResponse));
        }
    }, [setSupporters, originalHash, originalFileName]);

    return (
    <>
        <input hidden value={newSupporters} name='newsupporters'/>
        <ul>
            {ExistingSupporters.map(element => (
                <li>{element}</li>
            ))}
            {newSupporters.map((element, i) => (
                <li><input type="text" value={element} onChange={x => setPositionalNewSupporter(i, x.target.value)}/></li>
            ))}
            <li onClick={setNewSupporters(x => x.push(""))}>+Add person</li>
        </ul>
    </>);
}

function SaveButton(){
    return <input type="submit" name='submit' value='save'/>
}
function PublishButton(){
    return <input type="submit" name='submit' value='publish'/>
}



export function ChangeEditPage() {
    return (
        <>
            <StatusBar/>
            <form>
                <MainTextContent/>
                {/* <ChangeMotivation/>
                <ListOfSupporters/> */}
                <SaveButton/>
                <PublishButton/>
            </form>
        </>
    );
}