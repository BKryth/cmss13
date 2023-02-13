import { useBackend } from '../backend';
import { Button, Section, Flex, Table } from '../components';
import { Window } from '../layouts';
import { useRef }from 'common/react';

const row = [0, 1, 2, 3, 4, 5, 6, 7];

export const ChessBoard = (props, context) => {
  return (
    <Window width={720} height={950}>
      <Window.Content scrollable>
        <WhiteChessPieces />
        <ChessBoardContent />
        <BlackChessPieces />
        <Test />
        <TestButton />
      </Window.Content>
    </Window>
  );
};

const Test = () => {
  const ref = useRef();
  const handleClick = () => {
    const element = document.getElementById("testID");
    element.style.content = "Testing";
    const element2 = ref.current;
  };
  return (
    <Button
    ref={ref}
    id="testID"
    content="TestButton"
    onClick={handleClick} />
  );
};

const TestButton = () => {
  const changeColor = (event) => {
    Reac.createRef();
  };
  return (
    <Button
    id="testID"
    content="Change TestButton Color"
    onClick={changeColor} />
  );
};


// Generate White Pieces
const WhiteChessPieces = (props, context) => {
  const { act, data } = useBackend(context);
  const {
    chess_pieces, selected,
  } = data;
  // Check if there is selected
  const select = (selected === null) ? 0 : selected[0].id;
  // Filter White Pieces
  const filtered_chess_pieces = chess_pieces.filter(piece => piece.color === "white");
  // Filter Pieces in Play
  const white_chess_pieces = filtered_chess_pieces.filter(piece => piece.played === 0);

  return (
    <Section title="White Chess Pieces">
      <Flex wrap="wrap" align="center" justify="space-evenly"
      onClick={() => act("Reset", {
        id : select,
      })}>
        {white_chess_pieces.map((piece) => (
          <Flex.Item key={piece.id}>
            <Button
            backgroundColor={select === piece.id ? "green" : "gray"}
            textColor="white"
            m="2px"
            content={piece.color + " " + piece.name}
            icon={"fa-solid fa-chess-" + piece.name}
            onClick={() => act("Select", {
              name : piece.name,
              color : piece.color,
              id : piece.id,
              played : piece.played,
              xposition : piece.xposition,
              yposition : piece.yposition,
              })} />
          </Flex.Item>
        ))}
      </Flex>
    </Section>
  );
};

// Generate Black Pieces
const BlackChessPieces = (props, context) => {

  const { act, data } = useBackend(context);
  const {
    chess_pieces, selected,
  } = data;
  // Check if there is selected
  const select = (selected === null) ? 0 : selected[0].id;
  // Filter Black Pieces
  const filtered_chess_pieces = chess_pieces.filter(piece => piece.color === "black");
  // Filter Pieces in Play
  const black_chess_pieces = filtered_chess_pieces.filter(piece => piece.played === 0);
  return (
    <Section title="Black Chess Pieces">
      <Flex wrap="wrap" align="center" justify="space-evenly"
      minHeight="4vh"
      onClick={() => act("Reset", {
          id : select,
        })}>
        {black_chess_pieces.map((piece, index) => (
          <Flex.Item key={index}>
            <Button
            backgroundColor={select === piece.id ? "green" : "gray"}
            textColor="black"
            m="2px"
            content={piece.color + " " + piece.name}
            icon={"fa-solid fa-chess-" + piece.name}
            onClick={() => act("Select", {
              name : piece.name,
              color : piece.color,
              id : piece.id,
              played : piece.played,
              xposition : piece.xposition,
              yposition : piece.yposition,
              })} />
          </Flex.Item>
        ))}
      </Flex>
    </Section>
  );
};

const ChessBoardContent = (props, context) => {
  // Front End
  return (
    <Section title="Chess Board">
      <GenerateRows />
    </Section>
  );
};

const GenerateRows = (props, context) => {
  const { act, data } = useBackend(context);
  const rows = [];
  for(let x = 0; x < 8; x++) {
    const row = [];
    const order = x % 2 === 1 ? 0 : 1;
    for(let y = 0; y < 8; y++) {
      row.push(GenerateCell(data, act, y + order, x+1, y+1));
    }
    rows.push(<Table.Row>{row}</Table.Row>);
  }
  return <Table> { rows } </Table>;
};

const GenerateCell = (data, act, index, xpos, ypos) => {
  // for getting the selected piece
  const select = (data.selected === null) ? 0 : data.selected[0].id;
  // for generating the mirrored tile
  const backgroundcolor = index % 2 === 1 ? "#564424" : "#ad9264";
  // for checking if the tile has a chess piece on it
  // filters only the played pieces
  const chess_piece_in_play = data.chess_pieces.filter(piece => piece.played === 1);
  // gets the one in the cells position
  const chess_piece_to_gen = chess_piece_in_play.findIndex(piece => piece.xposition === xpos && piece.yposition === ypos);
  return (chess_piece_to_gen === -1 ?
  // No Piece on Tile, onClick will update X, Y Position
  <Table.Cell
  backgroundColor={backgroundcolor}
  height="8vh"
  width="8vw"
  onClick={() => act("Place", { xposition : xpos, yposition : ypos })} />
  :
  // Piece on Tile, will Select the Tile
  <Table.Cell
  backgroundColor={select === chess_piece_in_play[chess_piece_to_gen].id ? "green" : backgroundcolor}
  height="8vh"
  width="8vw">
    <Button icon={"fa-solid fa-chess-" + chess_piece_in_play[chess_piece_to_gen].name}
    textColor={chess_piece_in_play[chess_piece_to_gen].color}
    fontSize="4vh"
    height="100%"
    width="100%"
    textAlign="center"
    verticalAlignContent="middle"
    backgroundColor="transparent"
    m="0"
    p="0"
    onClick={() => act("Select", {
      name : chess_piece_in_play[chess_piece_to_gen].name,
      color : chess_piece_in_play[chess_piece_to_gen].color,
      id : chess_piece_in_play[chess_piece_to_gen].id,
      played : chess_piece_in_play[chess_piece_to_gen].played,
      xposition : chess_piece_in_play[chess_piece_to_gen].xposition,
      yposition : chess_piece_in_play[chess_piece_to_gen].yposition,
      })} />
  </Table.Cell>
  );
};
