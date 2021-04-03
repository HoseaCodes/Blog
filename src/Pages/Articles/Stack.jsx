import React from 'react'
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import EventNoteIcon from '@material-ui/icons/EventNote';
import MessageIcon from '@material-ui/icons/Message';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import StackResults from '../../icons/StackResults.png'
import Stackimg from '../../icons/Stackimg.png';
import './Articles.css'

const Stack = () => {
    return (
        <div>
            <div class="blog-content">
                <h2>Data Struture: Stack</h2>
                <div className='blog-card'>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }} class="post-meta mb-30">
                        <PermIdentityIcon /> <span> By Dominique Hosea</span>
                        <EventNoteIcon /> <span> October 13, 2020</span>
                        <MessageIcon /> <span> 5</span>
                        <ThumbUpIcon /> <span>12 k</span>
                    </div>
                    <h3>What is stack data structure?</h3>
                    <p>The data is placed in a stack like position where the left most position is the bottom.
                    Stacks operate off of the LIFO or Last in first out method. </p>
                    <h3>Methods</h3>
                    <p>Push() method for adding to the last position of the stack.
                    <br />
                or
                <br />
                Pop() method for removing the last element from the stack.
                <br />
                Peek() method for checking the top most element on the stack.
                </p>

                    <h3>When is a stack data stucture useful?</h3>
                    <img src={Stackimg} alt="Stack" />
                    <img src={StackResults} alt="Results" />
                </div>
            </div>
            <div class="post-a-comment-area mb-100 clearfix">
                <h3 class="mb-50">Leave a comment</h3>

                {/* <!-- Reply Form --> */}
                <div class="contact-form-area">
                    <form action="#" method="post">
                        <div class="row">
                            <div class="col-12 col-lg-6">
                                <input type="text" class="form-control" id="name" placeholder="Your Name*"
                                    required />
                            </div>
                            <div class="col-12">
                                <textarea name="message" class="form-control" id="message" cols="30" rows="10"
                                    placeholder="Message*" required></textarea>
                            </div>
                            <div class="col-12">
                                <button class="btn videomag-btn mt-30" type="submit">Submit Comment</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Stack;