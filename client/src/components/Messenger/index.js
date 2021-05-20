import React, {useEffect, useState} from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import './Messenger.css';

export default function Messenger(props) {
    const [corresponding, setCorresponding] = useState("");
    const [corresponding_id, setCorresponding_id] = useState("");

    const clickConv = (title, _id) => {
      setCorresponding(title);
      setCorresponding_id(_id);
    }

    useEffect(() => {
    },[corresponding, corresponding_id])

    return (
      <div className="messenger">
        {/* <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" />
          ]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        /> */}

        {/* <Toolbar
          title="Conversation Title"
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        /> */}

        <div className="scrollable sidebar">
          <ConversationList setTitle={clickConv}/>
        </div>

        <div className="scrollable content">
          <MessageList title={corresponding} _id={corresponding_id} socket={props.socket}/>
        </div>
      </div>
    );
}