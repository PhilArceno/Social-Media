import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Route, Link } from 'react-router-dom'
import styled from 'styled-components'

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

const Tag = styled.div`
    margin: 0 0.5em;
    width: '-webkit-fill-available';

    &:hover {
    cursor: pointer;
    text-decoration: line-through;
  }
`

const Button = styled.button`
    border-radius: 5px;
    border: none;
    padding: 1em;
    background-color: #8d02ff;
    color: white;
    box-shadow: 5px 5px 10px #e2e2e2, -5px -5px 10px #f7f7f7;
    width:20%;
    max-width:600px;

`

const InputContainer = styled.div` 
margin: 1em 0;
    width:100%;
        display:flex;
        justify-content: space-between;
`

const TagInput = styled.input`
        width: 70%;
`

const Submit = styled.input`
    border-radius: 5px;
    border: none;
    padding: 1em;
    background-color: #8d02ff;
    color: white;
    box-shadow: 5px 5px 10px #e2e2e2, -5px -5px 10px #f7f7f7;
    width:100%;
    max-width:600px;

    @media only screen and (min-width: 990px) {
        width: 100px;
    }
`

function EditPost(props) {
    const [post, setPost] = useState({thisPost: []})
    const [fields, setFields] = useState({
        description: '',
        location: '',
        tags: [],
        tagInput: ''
    })

    const validateUser = async () => {
        let data = new FormData()
        data.append('postId', props.postId)
        let response = await fetch('/get-edit-post', {method: 'POST', body:data})
        let text = await response.text()
        let parsed = JSON.parse(text)
        if (parsed.success) {
            setPost({thisPost: parsed.post})
            setFields({
                description: parsed.post.description,
                location: parsed.post.location,
                tags: parsed.post.tags
            })
        }
    }

    useEffect(()=> {
        validateUser()
    }, [])

    const descriptionHandler = e => {
        setFields({ ...fields,
            description: e.target.value
        })
    }

    const locationHandler = e => {
        setFields({ ...fields,
            location: e.target.value
        })
    }

    
    const removeTagHandler = index => {
        let removeTag = fields.tags[index]

        let newArr = fields.tags.map(tag => {
            if (tag !== removeTag) {
                return tag
            }
        })

        setFields({...fields, tags: newArr})
    }

    const tagInputHandler = e => {
        setFields({...fields, tagInput: e.target.value})
    }

    
    const tagsHandler = e => {
        let tagExists = false
        let str = fields.tagInput
        str = str.replace(/\s+/g, '') //remove spaces. /s is the regex for "whitespace". and g is the "global" flag, meaning match all /s.
        if (!str) {
            return
        }
        fields.tags.forEach(tag => {
            if (tag === str) {
                tagExists = true
                return
            }
        })
        if (tagExists) return
        setFields({...fields, tags: fields.tags.concat(str), tagInput: ''})
    }

    const handleSubmit = async e => {
        e.preventDefault()

        let data = new FormData()
        data.append('postId', props.postId)
        data.append('description', fields.description)
        data.append('location', fields.location)
        data.append('tags', fields.tags)
        let response = await fetch('/edit/post', {method: 'POST', body:data})
        let text = await response.text()
        let parsed = JSON.parse(text)
        if (parsed.success) {
            alert('Post edited.')
            props.history.push('/')
        }
    }

    const handleDelete = async () => {
        var r = confirm("Are you sure you want to delete this post?");
        if (!r) return


        let data = new FormData()
        data.append('postId', props.postId)
        let response = await fetch('/delete/post', {method: 'POST', body:data})
        let text = await response.text()
        let parsed = JSON.parse(text)
        if (parsed.success) {
            alert('Post deleted.')
            props.history.push('/')
        }
    }


    return (
        <div className="container">
            {post.thisPost ? 
                <div style={{width: '100%'}}>
                    <form onSubmit={handleSubmit}>
                        <h3 style={{textAlign: 'center'}}>Edit a post</h3>
                        <label><h5 style={{marginBottom:'1em'}}>Edit Location</h5></label>
                        <input style={{width: '-webkit-fill-available'}} type='text' className='textInput' value={fields.location} onChange={locationHandler}></input>

                        <label><h5 style={{marginBottom:'1em'}}>Edit Description</h5></label>
                        <textarea style={{width: '-webkit-fill-available', height: '100px', resize:'none', fontFamily:'sans-serif', paddingTop:'1em'}} 
                            className="textInput" type="text" onChange={descriptionHandler} value={fields.description} placeholder="Write a caption..."></textarea>

                        <label><h5 style={{marginBottom:'1em'}}>Tags:</h5></label>
                        <TagMap style={{display:'flex',flexWrap: 'wrap'}}>
                            {fields.tags ? fields.tags.map((tag, index) => (<Tag key={index} onClick={() => {removeTagHandler(index)}}>{tag}</Tag>)) : ''}
                        </TagMap>
                            <InputContainer>
                                <TagInput className="textInput" type="text" placeholder="Add tag" onChange={tagInputHandler} value={fields.tagInput}></TagInput>
                                <Button type='button' onClick={tagsHandler}>Add tag</Button>
                            </InputContainer>
                            <div style={{display:'flex', justifyContent:'center', width:'100%'}}>
                                <Submit type="submit"></Submit>
                            </div>
                    </form>
                    <div style={{color:'red', width:'fit-content', margin: '2em auto 0'}}onClick={handleDelete}>Delete this post</div>
                </div>
            : ''}
        </div>        
    )
}

export default EditPost