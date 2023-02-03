/datum/chess_piece
	var/name = "chess piece"
	var/color = "white"
	/// if 0, its not in a board
	var/board_piece_id = 0
	var/board_x_pos = 0
	var/board_y_pos = 0
	var/played = FALSE

/datum/chess_piece/New(set_name, set_color, set_id)
	color = "[set_color]"
	name = "[set_name]"
	board_piece_id = set_id
/// Toy Board Parent Object, for board games
/obj/item/toy/board
	name = "Chess Board"
	desc = "A simple chess board"
	icon = 'icons/obj/items/playing_cards.dmi'
	icon_state = "deck"
	w_class = SIZE_MEDIUM
	has_special_table_placement = TRUE

	/// Unused for now
	var/max_pieces = 64
	/// Chess pieces on the board
	var/list/datum/chess_piece/chess_pieces = list()
	/// Determines what is to be moved
	var/selected_piece = list();

	/// Testing, Remove once finished
	var/TestValue = 0


/obj/item/toy/board/Initialize()
	. = ..()
	generatepieces()

/// Generate the Chess Pieces
/obj/item/toy/board/proc/generatepieces()
	/// Used to generate the ID
	var/id_count = 1
	for(var/color as anything in list("black", "white"))
		// Pawns
		for(var/count = 1 to 8)
			chess_pieces += new /datum/chess_piece("pawn", color, id_count++)

		// Rook/Knight/Bishop
		for(var/piece_name as anything in list("rook", "knight", "bishop"))
			chess_pieces += new /datum/chess_piece(piece_name, color, id_count++)
			chess_pieces += new /datum/chess_piece(piece_name, color, id_count++)

		// King/Queen
		for(var/piece_name as anything in list("king", "queen"))
			chess_pieces += new /datum/chess_piece(piece_name, color, id_count++)

/// When Chess Board is moved, the board shakens
/obj/item/toy/board/Move(NewLoc, direct)
	..()
	if(table_setup)
		teardown()

/// When Chess Board is placed onto a table
/obj/item/toy/board/set_to_table(obj/structure/surface/target)
	..()
	if(table_setup)
		icon_state = "deck_uno"

/// Disassembly of Chess Board
/obj/item/toy/board/teardown()
	..()
	icon_state = "deck"

/// On click of Chessboard
/obj/item/toy/board/attack_hand(mob/user)
	if(!table_setup)
		return ..()
	else
		tgui_interact(user)


/// TGUI
/obj/item/toy/board/tgui_interact(mob/user, datum/tgui/ui)
	ui = SStgui.try_update_ui(user, src, ui)
	if(!ui)
		ui = new(user, src, "ChessBoard", name)
		ui.open()

/obj/item/toy/board/ui_data(mob/user)
	var/list/data = list()
	data["selected"] = list(selected_piece)
	data["chess_pieces"] = list()

	// Send the chess pieces data that is on the board
	for(var/datum/chess_piece/piece as anything in chess_pieces)
		var/list/piece_data = list()
		piece_data["name"] = piece.name
		piece_data["color"] = piece.color
		piece_data["id"] = piece.board_piece_id
		piece_data["played"] = piece.played
		piece_data["xposition"] = piece.board_x_pos
		piece_data["yposition"] = piece.board_y_pos
		data["chess_pieces"] += list(piece_data)

	// Delete After Testing
	data["health"] = TestValue
	data["color"] = "red"
	return data

/obj/item/toy/board/ui_act(action, params)
	if(..())
		return

	// On action
	switch(action)
		if("test")
			TestValue += 1
			. = TRUE
		if("Select")
			if(params["id"] == selected_piece["id"])
				selected_piece = list()
				to_chat(usr, SPAN_WARNING("You take the chess piece"))
				// Insert Action to Grab Chess piece to hand
				return . = TRUE

			selected_piece["name"] = params["name"]
			selected_piece["color"] = params["color"]
			selected_piece["id"] = params["id"]
			selected_piece["played"] = params["played"]
			selected_piece["xposition"] = params["xposition"]
			selected_piece["yposition"] = params["yposition"]
			. = TRUE
		if("Place")
			// Position relative to the chess board
			var/xposition = text2num(params["xposition"])
			var/yposition = text2num(params["yposition"])

			// No Chess Piece was selected
			if(length(selected_piece))
				var/selected_id = selected_piece["id"]
				chess_pieces[selected_id].played = TRUE
				chess_pieces[selected_id].board_x_pos = xposition
				chess_pieces[selected_id].board_y_pos = yposition
				. = TRUE
			else
				to_chat(usr, SPAN_WARNING("Select a Chess Piece to move"))
				. = TRUE
