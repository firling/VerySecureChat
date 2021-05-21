import React, { useState, useEffect } from "react";
import ConversationSearch from "../ConversationSearch";
import ConversationListItem from "../ConversationListItem";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton";
import axios from "axios";

import "./ConversationList.css";

export default function ConversationList(props) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!props._id) getConversations();
  }, []);

  const getConversations = () => {
    axios
      .get(`${window.env.SERVER_URL}/api/main/getUsers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        let newConversations = response.data.users.map((result) => {
          return {
            photo: "http://www.gravatar.com/avatar/?d=identicon",
            name: `${result.name}`,
            _id: `${result._id}`,
            text: "Hello world! This is a long message that needs to be truncated.",
          };
        });
        setConversations([...conversations, ...newConversations]);
        if (Object.keys(newConversations).length !== 0)
          props.setTitle(newConversations[0].name, newConversations[0]._id);
      });
  };

  return (
    <div className="conversation-list">
      <Toolbar
        title="Messenger"
        leftItems={[<ToolbarButton key="cog" icon="ion-ios-cog" />]}
        rightItems={[
          <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />,
        ]}
      />
      <ConversationSearch />
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation.name}
          data={conversation}
          setTitle={() => props.setTitle(conversation.name, conversation._id)}
        />
      ))}
    </div>
  );
}
