import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, green } from '@mui/material/colors';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { MainContext } from '../context/main/main-context';
import CircularProgress from '@mui/material/CircularProgress';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)',
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)',
      },
    },
  ],
}));

export default function RecipeViewCard({recipe, imagePath, width}) {

   const {
        title,
        ingredients,
        instructions,
        usedIngredients,
        missingIngredients,
        substitutions,
        dietaryModifications,
        scaling,
    } = recipe

    const {imageLoading,  imageUrl} = React.useContext(MainContext)
    

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

  return (
    <Card sx={{ maxWidth: width, ...(!expanded && { maxHeight: '630px' }) }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: green[500], width:'50px', height:'50px' }} aria-label="recipe">
            <RestaurantMenuIcon/>
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {title || ""}
            </Typography>
            }
        subheader={
            <Typography variant='caption' fontStyle="italic">
                Recipe You Love
            </Typography>
        }
      />
     {imageLoading ? (
        <div style={{ height: 394, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </div>
        ) : (
            imagePath ?(
                <CardMedia
                    component="img"
                    height="394"
                    src={imagePath}
                    alt="Recipe Image"
                />

            ):
            (
                <CardMedia
                    component="img"
                    height="394"
                    image='./img/Rectangle-319.webp'
                    alt="Recipe Image"
                />

            )
        
    )}

      <CardContent sx={{width:'600px'}}>
        
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          See Details
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>

          <Typography sx={{ marginBottom: 2 }} component='h5'>🧂 Ingredients:</Typography>
             <ul>
                {ingredients?.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>

          <Typography sx={{ marginBottom: 2 }} component='h5'>✅ Used Ingredients:</Typography>
             <ul>
                {usedIngredients?.map((item, index) => (
                    <li key={index} className="text-success font-weight-bold">
                    {item}
                    </li>
                ))}
            </ul>

          <Typography sx={{ marginBottom: 2 }} component='h5'>❌ Missing Ingredients:</Typography>
             <ul>
                {missingIngredients?.map((item, index) => (
                    <li key={index} className="text-danger font-weight-bold">
                    {item}
                    </li>
                ))}
            </ul>
          {substitutions && (
            <>
                <Typography sx={{ marginBottom: 2 }} component='h5'>🔁 Substitutions:</Typography>
                <ul>
                    {Object.entries(substitutions).map(([original, substitute], index) => (
                        <li key={index}>
                            <span className="highlight-sub">
                            {original} ➜ {substitute}
                            </span>
                        </li>
                    ))}
                </ul>
            </>
          )}

          {instructions && (
            <>
                <Typography sx={{ marginBottom: 2 }} component='h5'>👨‍🍳 Instructions:</Typography>
                <ol>
                    {instructions
                    .split(/(?=\d\.)/)
                    .filter((step) => step.trim())
                    .map((step, index) => (
                        <li key={index}>{step.trim()}</li>
                    ))}
                </ol>
            </>
          )}

          {dietaryModifications && (
            <>
                <Typography sx={{ marginBottom: 2 }} component='h5'>🌱 Dietary Modifications:</Typography>
                <ul>
                    {Object.entries(dietaryModifications).map(([type, note], index) => (
                    <li key={index}>
                        <strong>{type}:</strong> {note}
                    </li>
                    ))}
                </ul>
            </>
          )}

          {scaling && (
            <>
                <Typography sx={{ marginBottom: 2 }} component='h5'>📏 Scaling Options:</Typography>
                <ul>
                    <li>
                    <strong>2 servings:</strong> {scaling["2_servings"]}
                    </li>
                    <li>
                    <strong>4 servings:</strong> {scaling["4_servings"]}
                    </li>
                </ul>
            </>
          )}
          
        </CardContent>
      </Collapse>
    </Card>
  );
}
