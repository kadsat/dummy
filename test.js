function syncNormalizedState(state) {
  function getAllChildrenIds(parentId) {
    return Object.keys(state).filter(childId => childId.slice(0, parentId.length) === parentId);
  }

  let level = 1;
  let nodes = Object.keys(state).filter(item => item.split('-').length === level);

  while (nodes.length > 0) {
    nodes = Object.keys(state).filter(item => item.split('-').length === level);
    nodes = nodes.sort();
    let expectedId = null;

    for (let i = 1; i < nodes.length; i++) {
      let segments;
      if (expectedId) {
        segments = expectedId.split('-');
      } else {
        segments = nodes[i - 1].split('-');
      }

      segments[segments.length - 1] = String(parseInt(segments[segments.length - 1]) + 1);
      expectedId = segments.join('-');

      if (
        nodes[i - 1].slice(0, -2) === nodes[i].slice(0, -2) &&
        expectedId !== nodes[i]
      ) {
        let newParentId = expectedId;
        for (let existingId of getAllChildrenIds(nodes[i])) {
          let leftOverId = existingId.slice(newParentId.length + 1);
          let newId = leftOverId ? `${newParentId}-${leftOverId}` : newParentId;
          state[newId] = state[existingId];
          delete state[existingId];
        }
      }
    }

    level += 1;
  }

  return state;
}
