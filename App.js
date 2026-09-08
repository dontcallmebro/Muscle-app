import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RED = '#ff3b3f';
const INK = '#171717';
const MUTED = '#777';
const CARD = '#ffffff';
const BG = '#f5f5f5';
const STORAGE_KEY = 'muscle-lab-workouts-v1';

const MUSCLES = [
  { id: 'chest', name: 'Pectoraux' },
  { id: 'back', name: 'Dos' },
  { id: 'shoulders', name: 'Épaules' },
  { id: 'biceps', name: 'Biceps' },
  { id: 'triceps', name: 'Triceps' },
  { id: 'quads', name: 'Quadriceps' },
  { id: 'hamstrings', name: 'Ischios' },
  { id: 'glutes', name: 'Fessiers' },
  { id: 'calves', name: 'Mollets' },
  { id: 'abs', name: 'Abdos' },
];

const EXERCISES = [
  { id: 'bench', name: 'Développé couché', primary: 'chest', secondary: ['triceps', 'shoulders'], equipment: 'Barre', level: 'intermédiaire', motion: 'press', reps: 8 },
  { id: 'incline', name: 'Développé incliné haltères', primary: 'chest', secondary: ['shoulders', 'triceps'], equipment: 'Haltères', level: 'intermédiaire', motion: 'press', reps: 10 },
  { id: 'fly', name: 'Écartés haltères', primary: 'chest', secondary: ['shoulders'], equipment: 'Haltères', level: 'débutant', motion: 'fly', reps: 12 },
  { id: 'crossover', name: 'Cable crossover', primary: 'chest', secondary: ['shoulders'], equipment: 'Poulie', level: 'intermédiaire', motion: 'fly', reps: 12 },

  { id: 'row', name: 'Rowing assis poulie', primary: 'back', secondary: ['biceps'], equipment: 'Poulie', level: 'débutant', motion: 'row', reps: 10 },
  { id: 'pulldown', name: 'Tirage vertical', primary: 'back', secondary: ['biceps'], equipment: 'Poulie', level: 'débutant', motion: 'pull', reps: 10 },
  { id: 'dbrow', name: 'Rowing unilatéral', primary: 'back', secondary: ['biceps'], equipment: 'Haltère', level: 'intermédiaire', motion: 'row', reps: 10 },

  { id: 'shoulderpress', name: 'Développé épaules', primary: 'shoulders', secondary: ['triceps'], equipment: 'Haltères', level: 'intermédiaire', motion: 'press', reps: 10 },
  { id: 'lateralraise', name: 'Élévations latérales', primary: 'shoulders', secondary: [], equipment: 'Haltères', level: 'débutant', motion: 'raise', reps: 12 },
  { id: 'frontraise', name: 'Élévations frontales', primary: 'shoulders', secondary: [], equipment: 'Haltères', level: 'débutant', motion: 'frontRaise', reps: 12 },

  { id: 'curl', name: 'Curl biceps', primary: 'biceps', secondary: [], equipment: 'Haltères', level: 'débutant', motion: 'curl', reps: 10 },
  { id: 'hammer', name: 'Curl marteau', primary: 'biceps', secondary: [], equipment: 'Haltères', level: 'débutant', motion: 'curl', reps: 10 },
  { id: 'pushdown', name: 'Extension triceps poulie', primary: 'triceps', secondary: [], equipment: 'Poulie', level: 'débutant', motion: 'pushdown', reps: 12 },
  { id: 'overheadtri', name: 'Extension triceps au-dessus de la tête', primary: 'triceps', secondary: [], equipment: 'Haltère', level: 'intermédiaire', motion: 'press', reps: 10 },

  { id: 'squat', name: 'Squat', primary: 'quads', secondary: ['glutes', 'hamstrings'], equipment: 'Barre', level: 'intermédiaire', motion: 'squat', reps: 8 },
  { id: 'legpress', name: 'Presse à cuisses', primary: 'quads', secondary: ['glutes', 'hamstrings'], equipment: 'Machine', level: 'débutant', motion: 'squat', reps: 10 },
  { id: 'legcurl', name: 'Leg curl', primary: 'hamstrings', secondary: [], equipment: 'Machine', level: 'débutant', motion: 'legCurl', reps: 12 },
  { id: 'hipthrust', name: 'Hip thrust', primary: 'glutes', secondary: ['hamstrings'], equipment: 'Barre', level: 'intermédiaire', motion: 'hip', reps: 10 },
  { id: 'calfraise', name: 'Mollets debout', primary: 'calves', secondary: [], equipment: 'Machine', level: 'débutant', motion: 'calf', reps: 15 },
  { id: 'crunch', name: 'Crunch câble', primary: 'abs', secondary: [], equipment: 'Poulie', level: 'débutant', motion: 'crunch', reps: 15 },
  { id: 'twist', name: 'Russian twist haltère', primary: 'abs', secondary: [], equipment: 'Haltère', level: 'intermédiaire', motion: 'twist', reps: 16 },
];

function muscleName(id) {
  return MUSCLES.find((m) => m.id === id)?.name || id;
}

function MuscleHighlight({ muscle, selected = true }) {
  if (!selected) return null;
  const red = { backgroundColor: RED };

  if (muscle === 'chest') {
    return <><View style={[styles.patch, styles.chestLeft, red]} /><View style={[styles.patch, styles.chestRight, red]} /></>;
  }
  if (muscle === 'shoulders') {
    return <><View style={[styles.roundPatch, styles.shoulderLeft, red]} /><View style={[styles.roundPatch, styles.shoulderRight, red]} /></>;
  }
  if (muscle === 'biceps') {
    return <><View style={[styles.armPatch, styles.bicepsLeft, red]} /><View style={[styles.armPatch, styles.bicepsRight, red]} /></>;
  }
  if (muscle === 'triceps') {
    return <><View style={[styles.armPatch, styles.tricepsLeft, red]} /><View style={[styles.armPatch, styles.tricepsRight, red]} /></>;
  }
  if (muscle === 'quads') {
    return <><View style={[styles.legPatch, styles.quadLeft, red]} /><View style={[styles.legPatch, styles.quadRight, red]} /></>;
  }
  if (muscle === 'hamstrings') {
    return <><View style={[styles.legPatch, styles.quadLeft, red]} /><View style={[styles.legPatch, styles.quadRight, red]} /></>;
  }
  if (muscle === 'calves') {
    return <><View style={[styles.calfPatch, styles.calfLeft, red]} /><View style={[styles.calfPatch, styles.calfRight, red]} /></>;
  }
  if (muscle === 'abs') return <View style={[styles.absPatch, red]} />;
  if (muscle === 'back') return <View style={[styles.backPatch, red]} />;
  if (muscle === 'glutes') return <View style={[styles.glutePatch, red]} />;
  return null;
}

function LoopingMannequin({ muscle, motion = 'press', large = false, selectedMuscles = null }) {
  const phase = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(phase, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(phase, { toValue: 0, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [phase]);

  const isSquat = ['squat', 'hip', 'legCurl', 'calf', 'crunch', 'twist'].includes(motion);
  const bodyY = phase.interpolate({ inputRange: [0, 1], outputRange: [0, isSquat ? 10 : 1] });

  const leftArmRotate = phase.interpolate({
    inputRange: [0, 1],
    outputRange:
      motion === 'raise' ? ['12deg', '-65deg'] :
      motion === 'frontRaise' ? ['18deg', '-40deg'] :
      motion === 'curl' ? ['8deg', '-45deg'] :
      motion === 'row' ? ['-10deg', '22deg'] :
      motion === 'fly' ? ['-55deg', '-20deg'] :
      motion === 'pushdown' ? ['-25deg', '12deg'] :
      ['-32deg', '-60deg'],
  });

  const rightArmRotate = phase.interpolate({
    inputRange: [0, 1],
    outputRange:
      motion === 'raise' ? ['-12deg', '65deg'] :
      motion === 'frontRaise' ? ['-18deg', '40deg'] :
      motion === 'curl' ? ['-8deg', '45deg'] :
      motion === 'row' ? ['10deg', '-22deg'] :
      motion === 'fly' ? ['55deg', '20deg'] :
      motion === 'pushdown' ? ['25deg', '-12deg'] :
      ['32deg', '60deg'],
  });

  const scale = large ? 1.35 : 0.88;
  const highlights = selectedMuscles || [muscle];

  return (
    <View style={[styles.animationBox, large && styles.animationBoxLarge]}>
      <Animated.View style={[styles.figure, { transform: [{ translateY: bodyY }, { scale }] }]}>
        <View style={styles.head} />
        <View style={styles.neck} />
        <View style={styles.torso} />
        <Animated.View style={[styles.upperArm, styles.leftArm, { transform: [{ rotate: leftArmRotate }] }]} />
        <Animated.View style={[styles.upperArm, styles.rightArm, { transform: [{ rotate: rightArmRotate }] }]} />
        <View style={[styles.thigh, styles.leftThigh]} />
        <View style={[styles.thigh, styles.rightThigh]} />
        <View style={[styles.shin, styles.leftShin]} />
        <View style={[styles.shin, styles.rightShin]} />
        {highlights.map((m) => <MuscleHighlight key={m} muscle={m} />)}
      </Animated.View>
      {!large && <View style={styles.loopBadge}><Text style={styles.loopBadgeText}>↻</Text></View>}
    </View>
  );
}

function Counter({ value, onMinus, onPlus }) {
  return (
    <View style={styles.counter}>
      <TouchableOpacity style={styles.counterButton} onPress={onMinus}><Text style={styles.counterButtonText}>−</Text></TouchableOpacity>
      <Text style={styles.counterValue}>{value}</Text>
      <TouchableOpacity style={styles.counterButton} onPress={onPlus}><Text style={styles.counterButtonText}>+</Text></TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState('muscles');
  const [selectedMuscles, setSelectedMuscles] = useState(['chest', 'shoulders', 'triceps']);
  const [selectedExercises, setSelectedExercises] = useState({});
  const [workoutName, setWorkoutName] = useState('Ma séance');
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) setSavedWorkouts(JSON.parse(raw));
    }).catch(() => {});
  }, []);

  const selectedList = useMemo(
    () => EXERCISES.filter((e) => selectedExercises[e.id]),
    [selectedExercises]
  );

  const totalSets = selectedList.reduce((sum, e) => sum + (selectedExercises[e.id]?.sets || 0), 0);

  const setsByMuscle = useMemo(() => {
    const result = {};
    selectedList.forEach((e) => {
      result[e.primary] = (result[e.primary] || 0) + selectedExercises[e.id].sets;
    });
    return result;
  }, [selectedList, selectedExercises]);

  function toggleMuscle(id) {
    setSelectedMuscles((current) => current.includes(id) ? current.filter((m) => m !== id) : [...current, id]);
  }

  function toggleExercise(exercise) {
    setSelectedExercises((current) => {
      const next = { ...current };
      if (next[exercise.id]) delete next[exercise.id];
      else next[exercise.id] = { sets: 3, reps: exercise.reps };
      return next;
    });
  }

  function changeExercise(id, key, delta) {
    setSelectedExercises((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [key]: Math.max(1, current[id][key] + delta),
      },
    }));
  }

  async function saveWorkout() {
    if (!selectedList.length) {
      Alert.alert('Séance vide', 'Ajoute au moins un exercice.');
      return;
    }
    const workout = {
      id: `${Date.now()}`,
      name: workoutName.trim() || 'Ma séance',
      createdAt: new Date().toISOString(),
      exercises: selectedList.map((e) => ({ ...e, ...selectedExercises[e.id] })),
      totalSets,
    };
    const next = [workout, ...savedWorkouts];
    setSavedWorkouts(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setTab('saved');
  }

  function loadWorkout(workout) {
    const next = {};
    workout.exercises.forEach((e) => { next[e.id] = { sets: e.sets, reps: e.reps }; });
    setSelectedExercises(next);
    setSelectedMuscles([...new Set(workout.exercises.flatMap((e) => [e.primary, ...e.secondary]))]);
    setWorkoutName(workout.name);
    setTab('workout');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{tab === 'muscles' ? 'Choisis tes muscles' : tab === 'workout' ? 'Préparer la séance' : 'Mes séances'}</Text>
      </View>

      {tab === 'muscles' && (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroCard}>
            <LoopingMannequin large selectedMuscles={selectedMuscles} muscle={selectedMuscles[0] || 'chest'} motion="raise" />
            <Text style={styles.heroTitle}>Sélection multiple</Text>
            <Text style={styles.heroText}>Choisis tous les groupes que tu veux travailler aujourd’hui.</Text>
          </View>

          <View style={styles.chips}>
            {MUSCLES.map((m) => {
              const active = selectedMuscles.includes(m.id);
              return (
                <TouchableOpacity key={m.id} style={[styles.chip, active && styles.chipActive]} onPress={() => toggleMuscle(m.id)}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{active ? '✓ ' : ''}{m.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedMuscles.length === 0 ? (
            <View style={styles.emptyCard}><Text style={styles.emptyTitle}>Sélectionne au moins un muscle</Text></View>
          ) : selectedMuscles.map((muscleId) => {
            const options = EXERCISES.filter((e) => e.primary === muscleId || e.secondary.includes(muscleId));
            return (
              <View key={muscleId} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{muscleName(muscleId)}</Text>
                  <Text style={styles.sectionCount}>{options.length} exercices</Text>
                </View>

                {options.map((exercise) => {
                  const added = !!selectedExercises[exercise.id];
                  const secondaryHere = exercise.primary !== muscleId;
                  return (
                    <View key={`${muscleId}-${exercise.id}`} style={styles.exerciseCard}>
                      <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                      <View style={[styles.levelPill, exercise.level === 'débutant' ? styles.beginnerPill : styles.intermediatePill]}>
                        <Text style={styles.levelText}>{exercise.level}</Text>
                      </View>
                      <LoopingMannequin muscle={exercise.primary} motion={exercise.motion} />
                      <View style={styles.exerciseFooter}>
                        <View style={styles.exerciseMeta}>
                          <Text style={styles.targetLabel}>Muscle ciblé : <Text style={styles.targetValue}>{muscleName(exercise.primary)}</Text></Text>
                          <Text style={styles.equipmentText}>{exercise.equipment}{secondaryHere ? ' · secondaire ici' : ''}</Text>
                        </View>
                        <TouchableOpacity style={[styles.addButton, added && styles.addButtonAdded]} onPress={() => toggleExercise(exercise)}>
                          <Text style={[styles.addButtonText, added && styles.addButtonTextAdded]}>{added ? '✓ Ajouté' : '+ Ajouter'}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })}
          <View style={{ height: 115 }} />
        </ScrollView>
      )}

      {tab === 'workout' && (
        <ScrollView contentContainerStyle={styles.content}>
          <TextInput value={workoutName} onChangeText={setWorkoutName} style={styles.nameInput} placeholder="Nom de la séance" placeholderTextColor="#999" />

          <View style={styles.totalCard}>
            <View><Text style={styles.totalNumber}>{totalSets}</Text><Text style={styles.totalLabel}>séries totales</Text></View>
            <View style={styles.totalDivider} />
            <View><Text style={styles.totalNumber}>{selectedList.length}</Text><Text style={styles.totalLabel}>exercices</Text></View>
          </View>

          {!!Object.keys(setsByMuscle).length && (
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Séries directes par muscle</Text>
              <View style={styles.breakdownWrap}>
                {Object.entries(setsByMuscle).map(([muscle, sets]) => (
                  <View key={muscle} style={styles.breakdownPill}>
                    <Text style={styles.breakdownName}>{muscleName(muscle)}</Text>
                    <Text style={styles.breakdownSets}>{sets}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedList.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Aucun exercice</Text>
              <Text style={styles.emptyText}>Retourne dans Muscles et ajoute tes mouvements.</Text>
            </View>
          ) : selectedList.map((exercise, index) => (
            <View key={exercise.id} style={styles.builderCard}>
              <View style={styles.builderTop}>
                <View style={styles.orderCircle}><Text style={styles.orderText}>{index + 1}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.builderTitle}>{exercise.name}</Text>
                  <Text style={styles.builderSub}>{muscleName(exercise.primary)} · {exercise.equipment}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleExercise(exercise)}><Text style={styles.removeText}>Retirer</Text></TouchableOpacity>
              </View>

              <View style={styles.builderControls}>
                <View style={styles.controlBlock}><Text style={styles.controlLabel}>Séries</Text><Counter value={selectedExercises[exercise.id].sets} onMinus={() => changeExercise(exercise.id, 'sets', -1)} onPlus={() => changeExercise(exercise.id, 'sets', 1)} /></View>
                <View style={styles.controlBlock}><Text style={styles.controlLabel}>Répétitions</Text><Counter value={selectedExercises[exercise.id].reps} onMinus={() => changeExercise(exercise.id, 'reps', -1)} onPlus={() => changeExercise(exercise.id, 'reps', 1)} /></View>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}><Text style={styles.saveButtonText}>Enregistrer cette séance</Text></TouchableOpacity>
          <View style={{ height: 110 }} />
        </ScrollView>
      )}

      {tab === 'saved' && (
        <ScrollView contentContainerStyle={styles.content}>
          {savedWorkouts.length === 0 ? (
            <View style={styles.emptyCard}><Text style={styles.emptyTitle}>Aucune séance sauvegardée</Text><Text style={styles.emptyText}>Prépare une séance puis enregistre-la ici.</Text></View>
          ) : savedWorkouts.map((workout) => (
            <TouchableOpacity key={workout.id} style={styles.savedCard} onPress={() => loadWorkout(workout)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.savedTitle}>{workout.name}</Text>
                <Text style={styles.savedSub}>{workout.exercises.length} exercices · {workout.totalSets} séries</Text>
              </View>
              <Text style={styles.savedArrow}>›</Text>
            </TouchableOpacity>
          ))}
          <View style={{ height: 110 }} />
        </ScrollView>
      )}

      {selectedList.length > 0 && tab === 'muscles' && (
        <TouchableOpacity style={styles.floatingSummary} onPress={() => setTab('workout')}>
          <View><Text style={styles.floatingTitle}>Préparer la séance</Text><Text style={styles.floatingSub}>{selectedList.length} exercices · {totalSets} séries</Text></View>
          <Text style={styles.floatingArrow}>›</Text>
        </TouchableOpacity>
      )}

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tab} onPress={() => setTab('muscles')}><Text style={[styles.tabIcon, tab === 'muscles' && styles.tabActive]}>◉</Text><Text style={[styles.tabText, tab === 'muscles' && styles.tabActive]}>Muscles</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setTab('workout')}><Text style={[styles.tabIcon, tab === 'workout' && styles.tabActive]}>≡</Text><Text style={[styles.tabText, tab === 'workout' && styles.tabActive]}>Séance</Text></TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={() => setTab('saved')}><Text style={[styles.tabIcon, tab === 'saved' && styles.tabActive]}>♡</Text><Text style={[styles.tabText, tab === 'saved' && styles.tabActive]}>Sauvegardées</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: { backgroundColor: RED, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 15 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  content: { padding: 16, paddingBottom: 24 },

  heroCard: { backgroundColor: CARD, borderRadius: 24, padding: 16, alignItems: 'center', marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  heroTitle: { fontSize: 20, fontWeight: '800', color: INK, marginTop: 6 },
  heroText: { fontSize: 14, color: MUTED, textAlign: 'center', marginTop: 5, lineHeight: 20 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  chip: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 22, paddingVertical: 10, paddingHorizontal: 13, marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: RED, borderColor: RED },
  chipText: { color: '#555', fontWeight: '700', fontSize: 13 },
  chipTextActive: { color: '#fff' },

  section: { marginTop: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 22, color: INK, fontWeight: '900' },
  sectionCount: { color: MUTED, fontSize: 12 },

  exerciseCard: { backgroundColor: CARD, borderRadius: 23, padding: 12, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.09, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  exerciseTitle: { color: INK, fontSize: 17, fontWeight: '800', paddingRight: 110, marginBottom: 10 },
  levelPill: { position: 'absolute', right: 12, top: 11, borderRadius: 14, paddingVertical: 4, paddingHorizontal: 9 },
  beginnerPill: { backgroundColor: '#27b85a' },
  intermediatePill: { backgroundColor: '#f4c430' },
  levelText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  exerciseFooter: { flexDirection: 'row', alignItems: 'center', paddingTop: 10 },
  exerciseMeta: { flex: 1, paddingRight: 8 },
  targetLabel: { color: '#666', fontSize: 13 },
  targetValue: { color: RED, fontWeight: '800' },
  equipmentText: { color: '#999', fontSize: 12, marginTop: 3 },
  addButton: { borderWidth: 1.5, borderColor: RED, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 9 },
  addButtonAdded: { backgroundColor: RED },
  addButtonText: { color: RED, fontWeight: '800', fontSize: 12 },
  addButtonTextAdded: { color: '#fff' },

  animationBox: { height: 178, borderRadius: 19, backgroundColor: '#e9ebe4', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  animationBoxLarge: { height: 245, width: '100%', backgroundColor: '#eef0ea' },
  figure: { width: 120, height: 170, position: 'relative' },
  head: { position: 'absolute', top: 7, left: 47, width: 28, height: 34, borderRadius: 15, backgroundColor: '#9ca19c' },
  neck: { position: 'absolute', top: 37, left: 55, width: 12, height: 13, borderRadius: 5, backgroundColor: '#949a95' },
  torso: { position: 'absolute', top: 47, left: 38, width: 46, height: 63, borderRadius: 20, backgroundColor: '#89908b' },
  upperArm: { position: 'absolute', top: 53, width: 17, height: 65, borderRadius: 9, backgroundColor: '#858c87' },
  leftArm: { left: 23 },
  rightArm: { right: 21 },
  thigh: { position: 'absolute', top: 104, width: 20, height: 49, borderRadius: 10, backgroundColor: '#858c87' },
  leftThigh: { left: 39 },
  rightThigh: { right: 37 },
  shin: { position: 'absolute', top: 142, width: 15, height: 40, borderRadius: 8, backgroundColor: '#949a95' },
  leftShin: { left: 41 },
  rightShin: { right: 39 },
  patch: { position: 'absolute', width: 19, height: 13, borderRadius: 7, top: 55 },
  chestLeft: { left: 40 },
  chestRight: { left: 61 },
  roundPatch: { position: 'absolute', width: 13, height: 13, borderRadius: 8, top: 52 },
  shoulderLeft: { left: 30 },
  shoulderRight: { right: 29 },
  armPatch: { position: 'absolute', width: 11, height: 24, borderRadius: 7, top: 69 },
  bicepsLeft: { left: 25 },
  bicepsRight: { right: 23 },
  tricepsLeft: { left: 27, top: 78 },
  tricepsRight: { right: 25, top: 78 },
  legPatch: { position: 'absolute', width: 14, height: 34, borderRadius: 8, top: 111 },
  quadLeft: { left: 42 },
  quadRight: { right: 40 },
  calfPatch: { position: 'absolute', width: 10, height: 24, borderRadius: 6, top: 149 },
  calfLeft: { left: 43 },
  calfRight: { right: 41 },
  absPatch: { position: 'absolute', width: 19, height: 32, borderRadius: 8, top: 73, left: 51 },
  backPatch: { position: 'absolute', width: 35, height: 36, borderRadius: 12, top: 55, left: 43 },
  glutePatch: { position: 'absolute', width: 35, height: 17, borderRadius: 10, top: 98, left: 43 },
  loopBadge: { position: 'absolute', bottom: 8, right: 8, width: 27, height: 27, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  loopBadgeText: { color: '#fff', fontWeight: '900' },

  floatingSummary: { position: 'absolute', left: 16, right: 16, bottom: 78, backgroundColor: '#1d1d1f', borderRadius: 18, paddingVertical: 13, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 20 },
  floatingTitle: { color: '#fff', fontSize: 15, fontWeight: '900' },
  floatingSub: { color: '#bbb', fontSize: 12, marginTop: 2 },
  floatingArrow: { color: '#fff', fontSize: 30 },

  nameInput: { backgroundColor: '#fff', borderRadius: 16, padding: 15, fontSize: 18, color: INK, fontWeight: '700', borderWidth: 1, borderColor: '#e2e2e2', marginBottom: 12 },
  totalCard: { backgroundColor: '#1d1d1f', borderRadius: 20, padding: 18, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 12 },
  totalNumber: { color: '#fff', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  totalLabel: { color: '#bbb', fontSize: 12, textAlign: 'center', marginTop: 3 },
  totalDivider: { width: 1, height: 42, backgroundColor: '#444' },
  breakdownCard: { backgroundColor: '#fff', borderRadius: 18, padding: 14, marginBottom: 12 },
  breakdownTitle: { color: INK, fontSize: 15, fontWeight: '800', marginBottom: 10 },
  breakdownWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  breakdownPill: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderRadius: 15, paddingVertical: 7, paddingHorizontal: 10, marginRight: 7, marginBottom: 7 },
  breakdownName: { color: '#555', fontSize: 12, fontWeight: '700' },
  breakdownSets: { color: RED, fontSize: 12, fontWeight: '900', marginLeft: 7 },

  builderCard: { backgroundColor: '#fff', borderRadius: 20, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  builderTop: { flexDirection: 'row', alignItems: 'center' },
  orderCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: RED, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  orderText: { color: '#fff', fontWeight: '900' },
  builderTitle: { color: INK, fontWeight: '800', fontSize: 15 },
  builderSub: { color: MUTED, fontSize: 12, marginTop: 3 },
  removeText: { color: RED, fontSize: 12, fontWeight: '700' },
  builderControls: { flexDirection: 'row', marginTop: 15 },
  controlBlock: { flex: 1, marginRight: 8 },
  controlLabel: { color: '#777', fontSize: 12, marginBottom: 7, fontWeight: '700' },
  counter: { flexDirection: 'row', alignItems: 'center' },
  counterButton: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#f1f1f1', justifyContent: 'center', alignItems: 'center' },
  counterButtonText: { fontSize: 20, color: INK, fontWeight: '800' },
  counterValue: { minWidth: 38, textAlign: 'center', color: INK, fontSize: 17, fontWeight: '900' },
  saveButton: { backgroundColor: RED, borderRadius: 17, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  emptyCard: { backgroundColor: '#fff', borderRadius: 20, padding: 28, alignItems: 'center', marginTop: 16 },
  emptyTitle: { color: INK, fontWeight: '900', fontSize: 17 },
  emptyText: { color: MUTED, textAlign: 'center', marginTop: 6 },
  savedCard: { backgroundColor: '#fff', borderRadius: 18, padding: 17, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  savedTitle: { color: INK, fontSize: 17, fontWeight: '900' },
  savedSub: { color: MUTED, fontSize: 12, marginTop: 4 },
  savedArrow: { color: RED, fontSize: 30, fontWeight: '500' },

  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, backgroundColor: 'rgba(255,255,255,0.98)', borderTopWidth: 1, borderTopColor: '#ddd', flexDirection: 'row', paddingBottom: 6 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { color: '#777', fontSize: 20, fontWeight: '800' },
  tabText: { color: '#777', fontSize: 11, fontWeight: '700', marginTop: 3 },
  tabActive: { color: RED },
});
