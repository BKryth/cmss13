import { useBackend } from '../backend';
import { Button, Section, Flex, Table } from '../components';
import { Window } from '../layouts';

const row = [0, 1, 2, 3, 4, 5, 6, 7];

export const ChessBoard = (props, context) => {
  return (
    <Window width={720} height={950}>
      <Window.Content scrollable>
        <WhiteChessPieces />
        <ChessBoardContent />
        <BlackChessPieces />
      </Window.Content>
    </Window>
  );
};

// Generate White Pieces
const WhiteChessPieces = (props, context) => {
  let color;
  const { act, data } = useBackend(context);
  const {
    chess_pieces, selected,
  } = data;
  // Filter White Pieces
  const filtered_chess_pieces = chess_pieces.filter(piece => piece.color === "white");
  // Filter Pieces in Play
  const white_chess_pieces = filtered_chess_pieces.filter(piece => piece.played === 0);
  return (
    <Section title="White Chess Pieces">
      <Flex wrap="wrap" align="center" justify="space-evenly">
        {white_chess_pieces.map((piece) => (
          <Flex.Item key={piece.id}>
            <Button
            backgroundColor={selected[0][0].id === piece.id ? "green" : "gray"}
            textColor="white"
            m="2px"
            content={piece.color + " " + piece.name}
            icon={"fa-solid fa-chess-" + piece.name}
            onClick={() => act("Select", { piece })} />
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
  // Filter Black Pieces
  const filtered_chess_pieces = chess_pieces.filter(piece => piece.color === "black");
  // Filter Pieces in Play
  const black_chess_pieces = filtered_chess_pieces.filter(piece => piece.played === 0);
  return (
    <Section title="Black Chess Pieces">
      <Flex wrap="wrap" align="center" justify="space-evenly">
        {black_chess_pieces.map((piece, index) => (
          <Flex.Item key={index}>
            <Button
            backgroundColor={selected[0][0].id === piece.id ? "green" : "gray"}
            textColor="black"
            m="2px"
            content={piece.color + " " + piece.name}
            icon={"fa-solid fa-chess-" + piece.name}
            onClick={() => act("Select", { piece })} />
          </Flex.Item>
        ))}
      </Flex>
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
  // for generating the mirrored tile
  const color = index % 2 === 1 ? "#564424" : "#ad9264";
  // for checking if the tile has a chess piece on it
  const chess_piece_in_play = data.chess_pieces.filter(piece => piece.played === 1);
  const chess_piece_to_gen = chess_piece_in_play.find(piece => piece.xposition === xpos && piece.yposition === ypos);
  return (
  <Table.Cell
  backgroundColor={color}
  height="8vh"
  width="8vw"
  textColor={chess_piece_to_gen.color} // Delete After
  icon={"fa-solid fa-chess-" + chess_piece_to_gen.name}
  onClick={() => act("Place", { xposition : xpos, yposition : ypos })} >
    {xpos + " " + ypos + " remove later"}
  </Table.Cell>
  );
};

const ChessBoardContent = (props, context) => {
  const { act, data } = useBackend(context);
  const {
    health,
  } = data;
  // Front End
  return (
    <Section title="Chess Board">
      <GenerateRows />
      <Button
          content={health}
          backgroundColor="red" />
    </Section>
  );
};
