import React, { Component } from 'react';

class ListArray extends Component {
    constructor(props) {
        super(props);    
        this.state = {
        };
    }
    
        onDragOver = ev => {
            ev.preventDefault();
        };
    
        onDragStart = (ev, id, cardId) => {
            ev.dataTransfer.setData("id", id);
            ev.dataTransfer.setData("cardId", cardId);
        };
    
        onDrop = (ev, changeId) => {
            const id = ev.dataTransfer.getData("id");
            const cardId = ev.dataTransfer.getData("cardId");
            this.props.onDragAndDrop(id, cardId, changeId);
        };

    renderSelectedList = (id, data) => {
        const cardArray = [];
        if (data.length > 0) {
            data.forEach(card => {
                cardArray.push((
                    <div className="cards" key={card.id} draggable onDragStart={e => this.onDragStart(e, id, card.id)}>
                        <div className="cardTitle">{card.title}</div>
                        <div className="cardBtnAdj"><button type="button" onClick={() => this.deleteCard(id, card.id)}>X</button></div>
                        <hr/>
                        <div className="cardDesc">{card.description}</div>
                    </div>
                ));
            });
        }
        return cardArray;
    };

    addCard = (id) => {
        this.props.addCardItem(id);
    }

    deleteCard = (id, cardId) => {
        this.props.deleteCardItem(id, cardId);
    }

    renderLists = () => {
        const { list } = this.props;
        const listArray = [];
        if (list && list.data.length > 0) {
            list.data.forEach(item => {
                listArray.push((
                    <div className="box" key={item.id} onDragOver={e => this.onDragOver(e)} onDrop={e => this.onDrop(e, item.id)}>
                        <div className="boxSetup">
                            <div className="adjcircle"><button type="button" className="btnSn" onClick={() => this.addCard(item.id)}>+</button></div>
                        </div>
                        <div className="titleBox">{item.title}</div>
                        <div className="btnAdj"><button type="button" onClick={() => this.deleteList(item.id)}>X</button></div>
                        <hr/>
                        <div className="dropBox">
                            {this.renderSelectedList(item.id, item.cards) }
                        </div>
                    </div>
                ));
            });
        }
        return listArray;
    };

    deleteList = (data) => {
        this.props.deleteListItem(data);
    }

    render() {
        return (
            <>
                {this.renderLists()}
            </>
        );
    }
}

export default ListArray;
