function contactsComparator(c1, c2) {
  const time = c => new Date(c.get('lastMessageAt') || 0);
  return time(c2) - time(c1);
}

export function displayableUsers(state) {
  const userId = state.getIn(['auth', 'user', 'id']);
  return state.getIn(['users', 'items'])
    .delete(userId)
    .valueSeq()
    .filter(user => user.get('isActive'))
    .sort(contactsComparator);
}

// TODO(ivan): Figure out a better way to reference
// a path in the global state.
export function displayableGuestsFromItems(items) {
  return items
    .valueSeq()
    .filter(guest => !guest.get('isArchived'))
    .sort(contactsComparator);
}

export function displayableGuests(state) {
  return displayableGuestsFromItems(state.getIn(['guests', 'items']));
}
