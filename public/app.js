{
  "html": {
    "type": "Element",
    "name": "div",
    "attributes": [],
    "children": [
      {
        "type": "Text",
        "value": ""
      },
      {
        "type": "Element",
        "name": "button",
        "attributes": [
          {
            "type": "Attribute",
            "name": "on:click",
            "value": {
              "type": "Expression",
              "value": "increment"
            }
          }
        ],
        "children": [
          {
            "type": "Text",
            "value": "increment"
          }
        ]
      },
      {
        "type": "Element",
        "name": "p",
        "attributes": [],
        "children": [
          {
            "type": "Text",
            "value": "Count is"
          },
          {
            "type": "Expression",
            "value": "counter"
          }
        ]
      },
      {
        "type": "Element",
        "name": "button",
        "attributes": [
          {
            "type": "Attribute",
            "name": "on:click",
            "value": {
              "type": "Expression",
              "value": "decrement"
            }
          }
        ],
        "children": [
          {
            "type": "Text",
            "value": "decrement"
          }
        ]
      }
    ]
  }
}