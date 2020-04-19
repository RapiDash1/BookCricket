import React from "react";
import "./book.css";


class Book extends React.Component {
    constructor(props : any) {
        super(props);

        this.state = { x: 0, y: 0 };
    }



    handleDrag(e: any) {
        const originX = window.innerWidth*0.6;
        this.setState({ x: e.screenX, y: e.screenY });
        const bookCover = document.querySelector(".book-cover") as HTMLElement;
        const currentYRot = Number(bookCover.style.transform.slice(8, -4));
        // console.log((originX - e.screenX)/2);
        const newYRot = (originX - e.screenX)/4;
        if (newYRot >= 145) {
        }
        else if (currentYRot < newYRot) {
            bookCover.style["transform"] = "rotateY(" + newYRot.toString() + "deg" +")";
        }
        
    }

    resetBook() {
        const bookCover = document.querySelector(".book-cover") as HTMLElement;
        setTimeout(() => {
            bookCover.classList.toggle("book-cover-close");
            setTimeout(() => {
                bookCover.style["transform"] = "rotateY(0deg)";
                bookCover.classList.toggle("book-cover-close"); 
            }, 1900);
        }, 1500);
    }

    render() {
        return (

            <div className="book">
                <button className="drag-button"  draggable="true" onDrag={this.handleDrag.bind(this)} onDragEnd={this.resetBook}>DragMe</button>
                <div className="book-cover"></div> 
            </div>
        );
    }
}

export default Book;



