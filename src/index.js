const root = document.getElementById('root');
const data = {
  "id": "1538727956126",
  "value": "root",
  "children": [
      {
          "id": "1538727958550",
          "value": "child1",
          "children": [
              {
                  "id": "1538728010986",
                  "value": "subChild1",
                  "children": []
              },
              {
                  "id": "1538728026922",
                  "value": "subChild2",
                  "children": []
              }
          ]
      },
      {
          "id": "1538728063563",
          "value": "child2",
          "children": []
      },
      {
          "id": "1538728070971",
          "value": "child3",
          "children": []
      }
  ]
}

new TreeStruct(root, data).init();