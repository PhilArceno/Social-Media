import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    min-height: 300px;
    justify-content: space-evenly;
    max-width:600px;
    width:95%;
    align-items:center;

    > * {
        margin: 1em 0 1em 0;
    }
`

const TagsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    max-width:600px;
    width:95%;
    align-items:center;
    min-height: 150px;

    > * {
        margin: .5em 0 .5em 0;
    }
`

const Tag = styled.div`
    margin: 0 0.5em;

    &:hover {
    cursor: pointer;
    text-decoration: line-through;
  }
`

const TagMap = styled.div`
width: -webkit-fill-available;
max-height:150px;
overflow-y: auto;
overflow-x:hidden;
border: none;
border-radius: 5px; 
padding: .5em;
background: lightgray;

:hover {
    background: #fbfbfb;
    box-shadow: inset 8px 8px 16px #f1f1f1, 
                 inset -8px -8px 16px #f7f7f7;
        outline:none;
}

`

const Button = styled.button`
    border-radius: 5px;
    border: none;
    padding: 1em;
    background-color: #8d02ff;
    color: white;
    box-shadow: 5px 5px 10px #e2e2e2, -5px -5px 10px #f7f7f7;
    width: 30%;
    max-width:600px;
`

const Submit = styled.input`
    border-radius: 5px;
    border: none;
    padding: 1em;
    background-color: #8d02ff;
    color: white;
    box-shadow: 5px 5px 10px #e2e2e2, -5px -5px 10px #f7f7f7;
    width:95%;
    max-width:600px;

    @media only screen and (min-width: 990px) {
        width: 100px;
    }
`

const InputContainer = styled.div`
width:100%;
        display:flex;
        justify-content: space-between;
`

const TagInput = styled.input`
height:auto;
        width: 65%;
`

function CreatePost(props) {
    const [newPost, setNewPost] = useState({
        files: [], 
        description: '',
        tagInput: '',
        tags: [],
        location: ''
    })

    const fileChangeHandler = e => {
        setNewPost({...newPost, files: [...e.target.files]})
      }

    const descriptionHandler = e => {
        setNewPost({...newPost, description: e.target.value})
    }

    const tagInputHandler = e => {
        setNewPost({...newPost, tagInput: e.target.value})
    }

    const tagsHandler = e => {
        let tagExists = false
        let str = newPost.tagInput
        str = str.replace(/\s+/g, '') //remove spaces. /s is the regex for "whitespace". and g is the "global" flag, meaning match all /s.
        if (!str) {
            return
        }
        newPost.tags.forEach(tag => {
            if (tag === str) {
                tagExists = true
                return
            }
        })
        if (tagExists) return
        setNewPost({...newPost, tags: newPost.tags.concat(str), tagInput: ''})
    }


    const locationHandler = e => {
        setNewPost({...newPost, location: e.target.value})
    }

    const removeTagHandler = index => {
        let removeTag = newPost.tags[index]

        let newArr = newPost.tags.map(tag => {
            if (tag !== removeTag) {
                return tag
            }
        })

        setNewPost({...newPost, tags: newArr})
    }

    const submitHandler = async e => {
        e.preventDefault()
        if (!newPost.files[0] || !newPost.description) {
            alert('Please complete all fields')
            return
        }

        let data = new FormData()
        newPost.files.forEach(file => data.append('images', file))
        data.append('description', newPost.description)
        data.append('tags', newPost.tags)
        data.append('location', newPost.location)
        data.append('profilePicture', props.user.profilePicture)
        let response = await fetch('/create/post', {method: 'POST', body: data})
        
        let body = await response.text()
        let parsed = JSON.parse(body)
        if (parsed.success) {
            alert('Post was uploaded!')
            setNewPost({
                files: [], 
                description: '', 
                tags: [],
                taggedUsers: [],
                location: ''
            })
        }
    }

    return (
        <div className="container">
            <FormContainer onSubmit={submitHandler}>
                <h3>Upload a post</h3>
               <input type="file" multiple onChange={fileChangeHandler}></input>
               <textarea style={{width: '95%', height: '100px', resize:'none', fontFamily:'sans-serif', paddingTop:'1em'}} className="textInput" type="text" onChange={descriptionHandler} value={newPost.description} placeholder="Write a caption..."></textarea>
               <input style={{width: '95%'}} className="textInput" type="text" onChange={locationHandler} value={newPost.location} placeholder="Enter a location..."></input>
                <TagsContainer>
                    <div style={{display: 'flex'}}>Tags:</div>
                    <TagMap style={{display:'flex',flexWrap: 'wrap'}}>{newPost.tags.map((tag, index) => (<Tag key={index} onClick={() => {removeTagHandler(index)}}>{tag}</Tag>))}</TagMap>
                    <InputContainer>
                           <TagInput className="textInput" type="text" placeholder="Add tag" onChange={tagInputHandler} value={newPost.tagInput}></TagInput>
                           <Button type="button" onClick={tagsHandler}>Add tag</Button>
                    </InputContainer>       
                </TagsContainer>
               
               <Submit type="submit"></Submit>
            </FormContainer>
        </div>
    )
}

export default CreatePost