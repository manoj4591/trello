import React, { Component } from 'react';
import { Modal, Input} from 'antd';
import ListArray from './ListArray';

class App extends Component {
    constructor(props) {
        super(props);  
        this.state = {
            isModalVisible : false,
            listvalue: '',
            cardvalue: '',
            cardDesc: '',
            listItem: [],
            finalItem : {},
            isCardVisible : false,
            addCardId: null,
        };
    }

    componentDidMount(){
        if(localStorage.getItem('finalItems')){
            const finalItems = JSON.parse(localStorage.getItem('finalItems')) || 0;
            if(Object.keys(finalItems).length > 0){
                this.setState({ finalItem : finalItems, listItem: finalItems.data });
            }
        }  
    }

    addList = () => {
        this.setState({ isModalVisible : true, listvalue : ''});
    }

    handleSubmit = (event) => {
        const { listItem, listvalue } = this.state;
        event.preventDefault();
        const item = {
            "id" : listvalue.toUpperCase().split(" ").join(""),
            "title" : listvalue,
            "cards" : []
        };
        listItem.push(item);
        const finalItems = { data : listItem };
        localStorage.setItem('finalItems', JSON.stringify(finalItems));
        this.setState({ isModalVisible : false, finalItem : finalItems, listItem });
    }

    handleCancel = () => {
        this.setState({ isModalVisible : false});
    }

    handleChange = (e) => {
        this.setState({ listvalue : e.target.value});
    }

    deleteListItem = (e) => {
        const { finalItem } = this.state;
        const listItems = [];
        finalItem.data.forEach(x => {
            if(e !== x.id){
                listItems.push(x);
            }
        });
        const finalItems = { data : listItems };
        localStorage.setItem('finalItems', JSON.stringify(finalItems));
        this.setState({ finalItem : finalItems, listItem : listItems });
    }

    deleteCardItem = (id, cardId) => {
        const { finalItem } = this.state;
        const listItems = [];
        finalItem.data.forEach(x => {
            if(id === x.id){
                x.cards = this.deletedCard(x.cards, cardId);
                listItems.push(x);
            } else {
                listItems.push(x);
            }
        });
        const finalItems = { data : listItems };
        localStorage.setItem('finalItems', JSON.stringify(finalItems));
        this.setState({ finalItem : finalItems, listItem : listItems });
    }

    deletedCard = (data, cardId) => {
        const listCards = [];
        data.forEach(x => {
            if(x.id !== cardId) {
                listCards.push(x);
            }
        });
        return listCards;
    }

    addCardItem = (id) =>{
        this.setState({addCardId : id, isCardVisible : true, cardvalue : '', cardDesc : ''});
    } 

    handleChangeCardName = (e) => {
        this.setState({ cardvalue : e.target.value});
    }

    handleChangeDesc = (e) => {
        this.setState({ cardDesc : e.target.value});
    }

    handleCardSubmit = (event) => {
        const { finalItem, addCardId, cardvalue, cardDesc } = this.state;
        event.preventDefault();
        let listItems = [];
        const cardItem = {
            "id": cardvalue.toUpperCase().split(" ").join(""),
            "title": cardvalue,
            "description": cardDesc
        };
        finalItem.data.forEach(x => {
            if(addCardId === x.id){
                x.cards.push(cardItem);  
            }
            listItems.push(x);
        });
        const finalItems = { data : listItems };
        localStorage.setItem('finalItems', JSON.stringify(finalItems));
        this.setState({ isCardVisible : false, finalItem : finalItems, listItem: listItems });
    }

    addCardData = (changeId, copyCard) => {
        const { finalItem } = this.state;
        let listItems = [];
        finalItem.data.forEach(x => {
            if(changeId === x.id){
                x.cards.unshift(copyCard);  
            }
            listItems.push(x);
        });
        const finalItems = { data : listItems };
        localStorage.setItem('finalItems', JSON.stringify(finalItems));
        this.setState({ finalItem : finalItems, listItem: listItems });
    }

    handleCardCancel = () => {
        this.setState({ isCardVisible : false});
    }

    onDragAndDrop = (id, cardId, changeId) => {
        const { finalItem } = this.state;
        let copyCard = {};
        finalItem.data.forEach(x => {
            if(id === x.id){
                copyCard = this.copyCardData(x.cards, cardId);
            }
        });
        this.addCardData(changeId, copyCard);
        this.deleteCardItem(id, cardId);
    }

    copyCardData = (data, cardId) => {
        let cpCards = {};
        data.forEach(x => {
            if(x.id === cardId) {
                cpCards = x;
            }
        });
        return cpCards;
    }

    render() {
        const { isModalVisible, listvalue, finalItem, listItem, isCardVisible, cardvalue, cardDesc } = this.state;
        return (
            <>
                <div className="heading">Trello Board</div>
                <hr/>
                <div className="rowSet">
                    <button type="button" className="listButton" onClick={this.addList} >AddList</button>
                </div>
                <Modal title="Add List" visible={isModalVisible} onOk={this.handleSubmit} onCancel={this.handleCancel}>
                    <Input type="text" style={{ marginBottom : 10}} placeholder="Name" value={listvalue} onChange={this.handleChange} />
                </Modal>
                <Modal title="Add List" visible={isCardVisible} onOk={this.handleCardSubmit} onCancel={this.handleCardCancel}>
                    <Input type="text" style={{ marginBottom : 10}} placeholder="Name" value={cardvalue} onChange={this.handleChangeCardName} />
                    <Input type="text" style={{ marginBottom : 10}} placeholder="Description" value={cardDesc} onChange={this.handleChangeDesc} />
                </Modal>
                {listItem && listItem.length > 0 && <ListArray list={finalItem} deleteListItem={this.deleteListItem} deleteCardItem={this.deleteCardItem} addCardItem={this.addCardItem} onDragAndDrop={this.onDragAndDrop}></ListArray>}
            </>
        );
    }
}

export default App;
